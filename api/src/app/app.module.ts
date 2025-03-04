import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import * as path from "path";
import { ChannelsModule } from "src/channels/channels.module";
import { EnvironmentVariables, validateEnv } from "src/utils/env";
import { VideosModule } from "src/videos/videos.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60, limit: 10 }] }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        typesOutputPath: path.join(
          process.cwd(),
          "/src/types/generated/i18n.ts"
        ),
        loaderOptions: { path: path.join(__dirname, "../i18n/"), watch: true },
        fallbackLanguage: configService.getOrThrow("FALLBACK_LANGUAGE", {
          infer: true,
        }),
      }),
      resolvers: [AcceptLanguageResolver],
      inject: [ConfigService],
    }),
    VideosModule,
    ChannelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
