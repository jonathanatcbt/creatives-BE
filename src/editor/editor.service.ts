import { Injectable } from "@nestjs/common";
import { User } from "src/entities";
import { UserService } from "src/user/user.service";
import { UpdateEditorDto } from "./../dto";
import { ProjectService } from "src/project/project.service";
@Injectable()
export class EditorService {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService
  ) {}

  async findOne(value: string): Promise<User> {
    return await this.userService._findUser("id", value);
  }
  async findAll(): Promise<any> {
    return await this.userService._findAllUserwithAdmin("role", "editor");
  }

  async remove(id): Promise<any> {
    const result = await this.userService._deleteUsers(id);
    if (result.affected === 0) {
      return { status: false, message: "Editor not found" };
    }
    return { status: true, message: "Editor Delete successfully" };
  }
  async _update(id, updateEditorDto: UpdateEditorDto): Promise<any> {
    const editorUpdate = await this.userService._updateUsers(
      id,
      updateEditorDto
    );
    if (!editorUpdate)
      return {
        status: false,
        message:
          "The provided email is already registered with another Editor.",
      };
    return { status: true, message: "Editor Update successfully" };
  }
  async findEditorProject(editorId: any): Promise<any> {
    return await this.projectService._findProjects("editorId", editorId);
  }

  async findAdminEditor(adminId): Promise<any> {
    return await this.userService.findEditor(adminId);
  }

  async findAdminEditors(adminId): Promise<any> {
    return await this.userService.findEditors(adminId);
  }

  async changeEditor(updateProjectEditorDto): Promise<any> {
    await this.projectService._changeEditor(updateProjectEditorDto);
    return {
      status: true,
      message: "Project Editor Update Successfully",
    };
  }
}
