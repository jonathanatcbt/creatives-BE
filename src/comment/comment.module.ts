import { Module, forwardRef } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { Comments, Project } from "src/entities";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProjectModule } from "src/project/project.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments]),
    forwardRef(() => ProjectModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
