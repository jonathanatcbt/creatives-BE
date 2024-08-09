import { Module, forwardRef } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company, Project, User, ProjectStatusLog } from "src/entities";
import { ProjectModule } from "src/project/project.module";
import { SocketModule } from "src/socket/socket.module";
import { SocketGateway } from "src/socket/socket.gateway";
import { SocketService } from "src/socket/socket.service";
import { UploadModule } from "src/upload/upload.module";
import { UploadService } from "src/upload/upload.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Project, User, ProjectStatusLog]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
