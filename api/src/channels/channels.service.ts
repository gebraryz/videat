import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { YouTubeChannel } from "./channels.types";
import { VideosService } from "src/videos/videos.service";
import { EnvironmentVariables } from "src/utils/env";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "src/types/generated/i18n";

interface YouTubeChannelApiResponse {
  kind: "youtube#channelListResponse";
  etag: string;
  items: YouTubeChannel[];
}

@Injectable()
export class ChannelsService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly httpService: HttpService,
    private readonly videosService: VideosService
  ) {}

  async getChannelById(channelId: string) {
    const apiKey = this.configService.getOrThrow("YOUTUBE_API_KEY", {
      infer: true,
    });

    const videos = await this.videosService.getVideos({ channelId });
    const { data: channel } = await firstValueFrom(
      this.httpService.get<YouTubeChannelApiResponse>(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
      )
    );

    if (!channel || channel.items.length === 0) {
      throw new BadRequestException(this.i18n.t("channels.channel-not-found"));
    }

    if (!videos || !videos.data.length) {
      throw new BadRequestException(
        this.i18n.t("channels.no-videos-in-channel")
      );
    }

    return channel.items[0];
  }
}
