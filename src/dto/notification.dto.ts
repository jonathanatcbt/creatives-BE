import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class NotificationDto {
  @ApiProperty({ example: "string" })
  @IsString()
  fcm_token: string;
}
