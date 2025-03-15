import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFriendRequestDto {
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

}


