import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import {
  Brand,
  ClientEditingStatus,
  ClientOtherStatus,
  Comments,
  EditingStatus,
  OtherStatus,
  ProjectStatus,
  User,
  EditorNotification,
  ProjectOrdering,
  Company,
  ProjectEditor,
} from "./entities/index";
import { MailerModule } from "@nestjs-modules/mailer";
import { ClientModule } from "./clients/client.module";
import { EditorModule } from "./editor/editor.module";
import { Project } from "./entities";
import { ProjectModule } from "./project/project.module";
import { CommentModule } from "./comment/comment.module";
import { BrandModule } from "./brand/brand.module";
import { LoggingMiddleware } from "./middleware/logging.middleware";
const settings = require("./../typeorm.config");
import * as cors from "cors";
import { config } from "dotenv";
import { UploadModule } from "./upload/upload.module";
import { NotificationsModule } from "./notification/notifications.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { CompanyModule } from "./company/company.module";
import { SocketModule } from "./socket/socket.module";
import { SocketGateway } from "./socket/socket.gateway";

config();

@Module({
  imports: [
    SocketModule,
    MailerModule.forRoot({
      transport: {
        service: String(process.env.MAIL_SERVICE),
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.MAIL,
      },
    }),
    TypeOrmModule.forRoot(settings),
    TypeOrmModule.forFeature([
      Project,
      User,
      Comments,
      ProjectStatus,
      Brand,
      OtherStatus,
      EditingStatus,
      ClientOtherStatus,
      ClientEditingStatus,
      EditorNotification,
      ProjectEditor,
      ProjectOrdering,
      Company,
    ]),
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ClientModule,
    EditorModule,
    ProjectModule,
    CommentModule,
    BrandModule,
    UploadModule,
    NotificationsModule,
    CompanyModule,
    SocketModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors(), LoggingMiddleware).forRoutes("*");
  }
}
