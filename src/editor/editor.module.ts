import { Module } from "@nestjs/common";
import { EditorService } from "./editor.service";
import { EditorController } from "./editor.controller";
import { UserModule } from "src/user/user.module";
import { ProjectModule } from "src/project/project.module";

@Module({
  imports: [UserModule, ProjectModule],
  controllers: [EditorController],
  providers: [EditorService],
})
export class EditorModule {}
