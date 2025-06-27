import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { CreateVideoDto } from "./dto/create-video.dto";
import { GetVideosDto } from "./dto/get-videos.dto";
import { VideosService } from "./videos.service";

@Controller("videos")
export class VideosController {
  constructor(private videosService: VideosService) {}

  @Get()
  async getVideos(@Query() query: GetVideosDto) {
    const videos = await this.videosService.getVideos(query);

    return videos;
  }

  @Get("video-id/:videoId")
  async getVideo(@Param("videoId") videoId: string) {
    const data = await this.videosService.getVideoMetadataByItsId(videoId);

    return data;
  }

  @Get("languages")
  async getVideosLanguages() {
    const languages = await this.videosService.getVideosLanguages();

    return languages;
  }

  @Get("categories")
  async getVideosCategories() {
    const categories = await this.videosService.getVideosCategories();

    return categories;
  }

  @Get("tags")
  async getVideosTags() {
    const tags = await this.videosService.getVideosTags();

    return tags;
  }

  @Get("random")
  async getRandomVideo() {
    const data = await this.videosService.getRandomVideo();

    return data;
  }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async createVideo(@Body() dto: CreateVideoDto) {
    const data = await this.videosService.createVideo(dto.url);

    return data;
  }

  @Patch("video-id/:videoId")
  async increaseVideoClicks(@Param("videoId") videoId: string) {
    await this.videosService.increaseVideoClicks(videoId);
  }
}
