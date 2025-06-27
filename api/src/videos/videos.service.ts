import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { nanoid } from "nanoid";
import { I18nContext, I18nService } from "nestjs-i18n";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";
import { I18nTranslations } from "src/types/generated/i18n";
import { EnvironmentVariables } from "src/utils/env";
import { GetVideosDto } from "./dto/get-videos.dto";
import { YouTubeVideo, YouTubeVideoCategory } from "./videos.types";

interface YouTubeApiResponse {
  kind: string;
  etag: string;
  items: YouTubeVideo[];
  pageInfo: { totalResults: number; resultsPerPage: number };
}

export interface YouTubeApiCategoryListResponse {
  kind: "youtube#videoCategoryListResponse";
  etag: string;
  items: YouTubeVideoCategory[];
  pageInfo?: { totalResults: number; resultsPerPage: number };
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
        AND: [
          language ? { language: { equals: language } } : {},
          tags ? { tags: { hasSome: tags } } : {},
          channelId ? { channelId: { equals: channelId } } : {},
          categoryId ? { categoryId: { equals: categoryId } } : {},
          search
            ? {
                AND: search.split(" ").map((word) => ({
                  OR: [
                    { title: { search: `${word}:*` } },
                    { tags: { hasSome: [word] } },
                  ],
                })),
              }
            : {},
        ],
      },
    };

    const [count, videos] = await this.prismaService.$transaction([
      this.prismaService.video.count(),
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
          categoryId: true,
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

        const {
          snippet: {
            defaultAudioLanguage,
            defaultLanguage,
            title,
            channelId,
            channelTitle,
            description,
            thumbnails,
            tags,
          },
          id,
          contentDetails,
        } = data;

        const languageProvidedByYouTube =
          defaultAudioLanguage || defaultLanguage;
        const detectedLanguage = await this.detectLanguage(
          `${title} ${description || ""}`
        );

        const languageCode =
          languageProvidedByYouTube ?? detectedLanguage.trim();

        const languageDisplayName = this.i18n.t("videos.language", {
          args: {
            language: new Intl.DisplayNames([I18nContext.current().lang], {
              type: "language",
            }).of(
              languageProvidedByYouTube ??
                detectedLanguage.trim() ??
                languageProvidedByYouTube
            ),
          },
        });

        metadata.push({
          id: video.id,
          videoId: id,
          categoryId,
          title: title,
          tags: tags,
          language: { name: languageDisplayName, code: languageCode },
          channel: { id: channelId, title: channelTitle },
          clicks: video.clickHistory ? video.clickHistory.clicks : 0,
          url: this.setVideoUrlByVideoId(id),
          duration: this.parseDuration(contentDetails.duration),
          thumbnails: thumbnails,
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
      name: this.i18n.t("videos.language", {
        args: { language: displayNames.of(language) || language },
      }),
    }));
  }

  public async getVideosCategories() {
    const { lang: language } = I18nContext.current();

    const apiKey = this.configService.getOrThrow("YOUTUBE_API_KEY", {
      infer: true,
    });

    const { data: categories } = await firstValueFrom(
      this.httpService.get<YouTubeApiCategoryListResponse>(
        `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=${apiKey}`
      )
    );

    if (!categories || categories.items.length === 0) {
      throw new BadRequestException("Categories not found");
    }

    const updatedCategories = categories.items
      .map((item) => ({
        id: item.id,
        title:
          language === "en"
            ? item.snippet.title
            : this.i18n.t(
                `videos.categories.${item.id as keyof I18nTranslations["videos"]["categories"]}`
              ),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

    return updatedCategories;
  }

  public async getVideosTags() {
    const tags = await this.prismaService.video.findMany({
      select: { tags: true },
    });

    const allTags = tags.flatMap((video) => video.tags);

    const uniqueTags = [...new Set(allTags)];

    return uniqueTags.filter((tag) => tag).map((tag) => ({ name: tag }));
  }

  public async getRandomVideo() {
    const video = await this.prismaService.video.findFirst({
      orderBy: { createdAt: "desc" },
      where: { language: I18nContext.current().lang },
    });

    if (!video) {
      throw new BadRequestException(this.i18n.t("videos.video-not-found"));
    }

    const metadata = await this.generateVideoMetadata(
      this.setVideoUrlByVideoId(video.videoId)
    );

    return {
      id: video.id,
      videoId: metadata.id,
      title: metadata.snippet.title,
      url: this.setVideoUrlByVideoId(metadata.id),
      duration: this.parseDuration(metadata.contentDetails.duration),
      thumbnails: metadata.snippet.thumbnails,
    };
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
