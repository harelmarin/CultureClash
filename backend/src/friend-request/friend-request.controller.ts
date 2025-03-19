import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('friend-request')
@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  @ApiOperation({ summary: "Envoyer une demande d'ami" })
  @ApiResponse({
    status: 201,
    description: "Demande d'ami envoyée avec succès",
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  sendFriendRequest(@Body() createFriendRequestDto: CreateFriendRequestDto) {
    return this.friendRequestService.sendFriendRequest(createFriendRequestDto);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: "Accepter une demande d'ami" })
  @ApiResponse({ status: 200, description: "Demande d'ami acceptée" })
  @ApiResponse({ status: 404, description: "Demande d'ami non trouvée" })
  acceptFriendRequest(@Param('id') id: string) {
    return this.friendRequestService.acceptFriendRequest(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: "Refuser une demande d'ami" })
  @ApiResponse({ status: 200, description: "Demande d'ami refusée" })
  @ApiResponse({ status: 404, description: "Demande d'ami non trouvée" })
  rejectFriendRequest(@Param('id') id: string) {
    return this.friendRequestService.rejectFriendRequest(id);
  }

  @Get(':receiverId/pending')
  @ApiOperation({ summary: "Obtenir les demandes d'ami en attente" })
  @ApiResponse({
    status: 200,
    description: "Liste des demandes d'ami en attente récupérée",
  })
  @ApiResponse({
    status: 404,
    description: "Aucune demande d'ami en attente trouvée",
  })
  getPendingFriendRequests(@Param('receiverId') receiverId: string) {
    return this.friendRequestService.getPendingFriendRequests(receiverId);
  }
}
