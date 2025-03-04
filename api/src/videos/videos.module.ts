import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { VideosController } from "./videos.controller";
import { VideosService } from "./videos.service";

@Module({
  controllers: [VideosController],
  imports: [ConfigModule, HttpModule],
  providers: [VideosService, PrismaService],
  exports: [VideosService],
})
export class VideosModule {}
