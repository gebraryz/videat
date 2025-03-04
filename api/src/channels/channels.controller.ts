import { Controller, Get, Param } from "@nestjs/common";
import { ChannelsService } from "./channels.service";

@Controller("channels")
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get("id/:id")
  async getChannelById(@Param("id") id: string) {
    const data = await this.channelsService.getChannelById(id);

    return data;
  }
}
