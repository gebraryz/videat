import { Module } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { ChannelsController } from "./channels.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { VideosModule } from "src/videos/videos.module";

@Module({
  controllers: [ChannelsController],
  imports: [ConfigModule, HttpModule, VideosModule],
  providers: [ChannelsService, PrismaService],
})
export class ChannelsModule {}
