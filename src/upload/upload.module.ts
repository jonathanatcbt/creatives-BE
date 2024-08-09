import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

import { SocketModule } from "src/socket/socket.module";
import { CompanyModule } from "src/company/company.module";

@Module({
  imports: [
    CompanyModule,
    SocketModule,
    MulterModule.register({
      dest: "uploads/", // Specify the destination directory for uploaded files
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
