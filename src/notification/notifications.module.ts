import { Module, forwardRef } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { UserModule } from "src/user/user.module";
import { EditorNotification } from "src/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientModule } from "src/clients/client.module";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([EditorNotification]),
    forwardRef(() => ClientModule),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
