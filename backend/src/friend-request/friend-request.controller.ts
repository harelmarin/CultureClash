import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) { }

  @Post()
  sendFriendRequest(@Body() createFriendRequestDto: CreateFriendRequestDto) {
    return this.friendRequestService.sendFriendRequest(createFriendRequestDto);
  }

  @Patch(':id/accept')
  acceptFriendRequest(@Param('id') id: string) {
    return this.friendRequestService.acceptFriendRequest(id);
  }

  @Patch(':id/reject')
  rejectFriendRequest(@Param('id') id: string) {
    return this.friendRequestService.rejectFriendRequest(id);
  }

  @Get(':receiverId/pending')
  getPendingFriendRequests(@Param('receiverId') receiverId: string) {
    return this.friendRequestService.getPendingFriendRequests(receiverId);
  }

}
