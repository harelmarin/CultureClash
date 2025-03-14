import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) { }

  @Get(':id/follows')
  async getFollows(@Param('id') id: string) {
    return this.followService.getFollows(id);
  }

  @Get(':id/followers')
  async getFollowers(@Param('id') id: string) {
    return this.followService.getFollowers(id);
  }
}
