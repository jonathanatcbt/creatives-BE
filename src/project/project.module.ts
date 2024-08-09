import { Module, forwardRef } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ClientEditingStatus,
  ClientOtherStatus,
  Comments,
  EditingStatus,
  OtherStatus,
  Project,
  ProjectEditor,
  ProjectOrdering,
  ProjectStatus,
  ProjectStatusLog,
} from "src/entities";
import { UserModule } from "src/user/user.module";
import { ProjectStatusRepository } from "./projectStatus.repository";
import { NotificationsModule } from "src/notification/notifications.module";
import { ProjectStatusLogRepository } from "./projectStatusLog.repository";
import { ProjectEditingStatusRepository } from "./projectEditingStatus.repository";
import { ProjectOtherStatusRepository } from "./projectOtherStatus.repository";
import { ClientProjectEditingStatusRepository } from "./clientProjectEditingStatus.repository";
import { ClientOtherStatusRepository } from "./clientProjectOtherStatus.repository";
import { CommentModule } from "src/comment/comment.module";
import { CommentService } from "src/comment/comment.service";
import { EditorProejctRepository } from "./editorProject.repository";
import { CompanyModule } from "src/company/company.module";
import { SocketGateway } from "src/socket/socket.gateway";
import { SocketModule } from "src/socket/socket.module";
@Module({
  imports: [
    forwardRef(() => CommentModule),
    forwardRef(() => UserModule),

    TypeOrmModule.forFeature([
      ProjectOrdering,
      Project,
      ProjectStatus,
      EditingStatus,
      OtherStatus,
      ClientOtherStatus,
      ClientEditingStatus,
      ProjectStatusRepository,
      ProjectStatusLog,
      ProjectStatusLogRepository,
      ProjectOtherStatusRepository,
      ProjectEditingStatusRepository,
      ClientProjectEditingStatusRepository,
      ClientOtherStatusRepository,
      ProjectEditor,
    ]),
    NotificationsModule,
    CompanyModule,
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectStatusRepository,
    ProjectStatusLogRepository,
    ProjectOtherStatusRepository,
    ProjectEditingStatusRepository,
    ClientProjectEditingStatusRepository,
    ClientOtherStatusRepository,
    EditorProejctRepository,
    // CommentService,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
