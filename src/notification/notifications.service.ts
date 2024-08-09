import { Injectable, forwardRef, Inject } from "@nestjs/common";
import { firebaseAdmin } from "./firebase-admin";
import { UserService } from "src/user/user.service";
import { EditorNotification } from "src/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientService } from "src/clients/client.service";
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(EditorNotification)
    private readonly notificationRepository: Repository<EditorNotification>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ClientService))
    private readonly clientService: ClientService
  ) {}
  async sendNotifaction(data): Promise<any> {
    await this.clientService.notifactionSend(data);
  }
  async saveFcmToken(notificationDto, id): Promise<any> {
    await this.userService.addToken(notificationDto, id);
    return { status: true, message: "Token Save" };
  }
  async sendPushNotification(fcm_token, title, body, user, projectId) {
    const message = {
      token: fcm_token,
      notification: {
        title: title,
        body: body,
      },
    };
    console.log(message);
    try {
      const notification = new EditorNotification();
      notification.title = title;
      notification.body = body;
      notification.user = user;
      notification.projectId = projectId;

      // Save the EditorNotification entity
      const savedNotification = await this.notificationRepository.save(
        notification
      );
      if (fcm_token) {
        const response = await firebaseAdmin.messaging().send(message);
        console.log("Notification sent successfully:", response);
      }
      console.log(savedNotification);
      return true;
    } catch (error) {
      console.log(error);
      return true;
      // console.error("Error sending notification:", error);
    }
  }
  async getNotification(id): Promise<any> {
    console.log("id", id);
    return await this.notificationRepository.find({
      where: { user: { id: id }, projectHide: false },
      order: { createdAt: "DESC" },
    });
  }

  async notificationHide(id, projectHide): Promise<any> {
    return await this.notificationRepository.update(
      { projectId: id },
      {
        projectHide: projectHide,
      }
    );
  }
}
