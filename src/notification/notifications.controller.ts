import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Request,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { NotificationDto } from "./../dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiBody({ type: NotificationDto })
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async sendPushNotification(
    @Body() notificationDto: NotificationDto,
    @Request() req: any
  ) {
    return await this.notificationsService.saveFcmToken(
      notificationDto,
      req.user.userId
    );
  }
  @Get("/:id")
  async getNotification(@Param("id") id: number) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const notification = await this.notificationsService.getNotification(id);
    if (notification.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = notification;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }
}
