import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments, Project } from "./../entities/index";
import { CommentAddDto, CommentUpdateDto } from "./../dto";
import { ProjectService } from "src/project/project.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService
  ) {}

  async createComment(commentAddDto: CommentAddDto): Promise<any> {
    try {
      const project = await this.projectService._findProject(
        commentAddDto.projectId
      );

      if (!project) {
        throw new Error("Project not found");
      }
      const comment = new Comments();
      comment.commentText = commentAddDto.commentText;
      comment.project = project;

      const savedComment = await this.commentRepository.save(comment);

      return {
        status: true,
        message: "Comment Add Successfully",
      };
    } catch (err) {
      return {
        status: false,
        message: "Internal Server Error",
        error: "Bad Request",
      };
    }
  }
  async updateComment(comment, projectId): Promise<any> {
    try {
      const latestComment = await this.commentRepository.findOne({
        where: { project: { id: projectId } },
        order: { updatedAt: "DESC" }, // Assuming 'updatedAt' field is used to track modifications
      });

      if (!latestComment) {
        const commentAddDto = {
          projectId: projectId,

          commentText: comment,
        };
        return await this.createComment(commentAddDto);
      }

      // Step 2: Update the latest comment with the new comment text
      latestComment.commentText = comment;
      await this.commentRepository.save(latestComment);

      // Step 2: Update the comment with the new name
      comment = comment;
      const savedComment = await this.commentRepository.save(latestComment);

      return {
        status: true,
        message: "Comment Update Successfully",
      };
    } catch (err) {
      return {
        status: false,
        message: "Internal Server Error",
        error: "Bad Request",
      };
    }
  }
  async remove(id): Promise<any> {
    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      return { status: false, message: "Comment not found" };
    }
    return { status: true, message: "Comment Delete successfully" };
  }
}
