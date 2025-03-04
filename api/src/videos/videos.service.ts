import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { nanoid } from "nanoid";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";
import { EnvironmentVariables } from "src/utils/env";
import { GetVideosDto } from "./dto/get-videos.dto";
import { YouTubeVideo } from "./videos.types";
import { I18nContext, I18nService } from "nestjs-i18n";
import { I18nTranslations } from "src/types/generated/i18n";

interface YouTubeApiResponse {
  kind: string;
  etag: string;
  items: YouTubeVideo[];
  pageInfo: { totalResults: number; resultsPerPage: number };
}

@Injectable()
export class VideosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly prismaService: PrismaService
  ) {}

  public async getVideos({
    page = 1,
    limit = 10,
    sortBy = "clicks",
    sortOrder = "asc",
    categoryId,
    channelId,
    language,
    tags,
    search,
  }: GetVideosDto) {
    const metadata = [];

    const skip = (page - 1) * limit;

    const options = {
      skip,
      take: limit,
      where: {
        language: language ? { equals: language } : undefined,
        tags: tags ? { hasSome: tags } : undefined,
        channelId: channelId ? { equals: channelId } : undefined,
        categoryId: categoryId ? { equals: categoryId } : undefined,
        title: search
          ? {
              search: search
                .split(" ")
                .map((word) => `${word}:*`)
                .join(" | "),
            }
          : undefined,
      },
    };

    const [count, videos] = await this.prismaService.$transaction([
      this.prismaService.video.count(options),
      this.prismaService.video.findMany({
        ...options,
        orderBy: {
          ...(sortBy === "clicks"
            ? { clickHistory: { clicks: sortOrder === "asc" ? "asc" : "desc" } }
            : undefined),
          ...(sortBy === "createdAt"
            ? { createdAt: sortOrder === "asc" ? "asc" : "desc" }
            : undefined),
        },
        select: {
          id: true,
          videoId: true,
          title: true,
          duration: true,
          clickHistory: {
            select: { clicks: true },
          },
        },
      }),
    ]);

    if (videos && videos.length > 0) {
      for (const video of videos) {
        const data = await this.generateVideoMetadata(
          this.setVideoUrlByVideoId(video.videoId)
        );

        metadata.push({
          id: video.id,
          videoId: data.id,
          title: data.snippet.title,
          clicks: video.clickHistory ? video.clickHistory.clicks : 0,
          url: this.setVideoUrlByVideoId(data.id),
          duration: this.parseDuration(data.contentDetails.duration),
          thumbnails: data.snippet.thumbnails,
        });
      }
    }

    return {
      data: metadata,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        hasNextPage: page * limit < count,
        hasPreviousPage: page > 1,
      },
    };
  }

  public async getVideoMetadataById(id: string) {
    const video = await this.prismaService.video.findUnique({
      where: { id },
    });

    const metadata = await this.generateVideoMetadata(
      this.setVideoUrlByVideoId(video.videoId)
    );

    return metadata;
  }

  public async getVideoMetadataByItsId(videoId: string) {
    const video = await this.getVideoByYouTubeId(videoId);

    if (!video) {
      throw new BadRequestException(this.i18n.t("videos.video-not-found"));
    }

    const metadata = await this.generateVideoMetadata(
      this.setVideoUrlByVideoId(videoId)
    );

    return metadata;
  }

  public async createVideo(videoUrl: string) {
    const videoId = this.extractVideoId(videoUrl);

    if (!videoId) {
      throw new BadRequestException(this.i18n.t("videos.invalid-video-url"));
    }

    const video = await this.getVideoByYouTubeId(videoId);

    if (video) {
      throw new ConflictException(this.i18n.t("videos.video-already-exists"));
    }

    const metadata = await this.generateVideoMetadata(videoUrl);
    const createdVideo = await this.prismaService.video.create({
      data: {
        videoId,
        id: nanoid(9),
        tags: metadata.snippet.tags,
        channelId: metadata.snippet.channelId,
        categoryId: metadata.snippet.categoryId,
        title: metadata.snippet.title,
        duration: this.parseDuration(metadata.contentDetails.duration),
        language:
          metadata.snippet.defaultAudioLanguage ||
          metadata.snippet.defaultLanguage ||
          (
            await this.detectLanguage(
              `${metadata.snippet.title} ${metadata.snippet.description || ""}`
            )
          ).trim(),
      },
    });

    return createdVideo;
  }

  public async getVideosLanguages() {
    const { lang: language } = I18nContext.current();

    const languages = await this.prismaService.video.findMany({
      select: { language: true },
      distinct: ["language"],
    });

    const displayNames = new Intl.DisplayNames([language], {
      type: "language",
    });

    return languages.map(({ language }) => ({
      code: language,
      name: displayNames.of(language) || language,
    }));
  }

  public async increaseVideoClicks(videoId: string) {
    const video = await this.prismaService.video.findUnique({
      where: { videoId },
      include: { clickHistory: { select: { clicks: true } } },
    });

    if (!video) {
      throw new BadRequestException("Video not found");
    }

    const updatedVideo = await this.prismaService.video.update({
      where: { videoId },
      data: {
        clickHistory: {
          create: {
            id: nanoid(9),
            clicks: (video.clickHistory ? video.clickHistory.clicks : 0) + 1,
          },
        },
      },
    });

    return updatedVideo;
  }

  public async deleteVideo(videoId: string) {
    const video = await this.getVideoByYouTubeId(videoId);

    if (!video) {
      throw new BadRequestException(this.i18n.t("videos.video-not-found"));
    }

    const where = { videoId };

    await this.prismaService.$transaction([
      this.prismaService.videoClickHistory.deleteMany({ where }),
      this.prismaService.video.delete({ where }),
    ]);
  }

  private async getVideoByYouTubeId(videoId: string) {
    const data = await this.prismaService.video.findUnique({
      where: { videoId },
    });

    return data;
  }

  private async generateVideoMetadata(videoUrl: string) {
    const videoId = this.extractVideoId(videoUrl);

    if (!videoId) {
      throw new BadRequestException(this.i18n.t("videos.invalid-video-url"));
    }

    const apiKey = this.configService.getOrThrow("YOUTUBE_API_KEY", {
      infer: true,
    });

    if (!apiKey) {
      throw new BadRequestException("API key is missing");
    }

    const parts: (
      | "snippet"
      | "contentDetails"
      | "statistics"
      | "status"
      | "player"
      | "topicDetails"
      | "recordingDetails"
      | "liveStreamingDetails"
      | "localizations"
      | "fileDetails"
      | "processingDetails"
      | "suggestions"
      | "brandingSettings"
    )[] = ["contentDetails", "topicDetails", "snippet", "statistics", "player"];

    const { data: video } = await firstValueFrom(
      this.httpService.get<YouTubeApiResponse>(
        `https://www.googleapis.com/youtube/v3/videos?part=${parts.join(
          ","
        )}&id=${videoId}&key=${apiKey}`
      )
    );

    if (!video || video.items.length === 0) {
      throw new BadRequestException("Video not found");
    }

    return video.items[0];
  }

  private setVideoUrlByVideoId(videoId: string) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  private extractVideoId(videoUrl: string) {
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;

    const match = videoUrl.match(regex);

    return match ? match[1] : null;
  }

  private parseDuration(duration: string) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!match) {
      return 0;
    }

    const hours = match[1] ? parseInt(match[1], 10) * 3600 : 0;
    const minutes = match[2] ? parseInt(match[2], 10) * 60 : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;

    return hours + minutes + seconds;
  }

  private async detectLanguage(text: string) {
    const { franc } = await import("franc");
    const { iso6393 } = await import("iso-639-3");

    const languageInIso6393 = franc(text, { minLength: 10 });

    const languageEntry = iso6393.find(
      (language) => language.iso6393 === languageInIso6393
    );
    const languageInIso6391 = languageEntry.iso6391;

    return languageInIso6391;
  }
}
