import { Repository } from "typeorm";
import { ProjectEditor } from "../entities/index";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull } from "typeorm";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

export class EditorProejctRepository {
  constructor(
    @InjectRepository(ProjectEditor)
    private readonly editorProejctRepository: Repository<ProjectEditor>
  ) {}

  async _creatEditorProject(projectData, editors) {
    try {
      for (let i = 0; i < editors.length; i++) {
        const projectEditor = new ProjectEditor();
        projectEditor.editor = editors[i];
        projectEditor.project = projectData.id;
        await this.editorProejctRepository.save(projectEditor);
      }
    } catch (err) {
      throw err;
    }
  }

  async _update(projectData, editors) {
    try {
      await this.editorProejctRepository.delete({
        project: projectData.id,
      });

      if (editors && editors.length > 0)
        await this._creatEditorProject(projectData, editors);
    } catch (err) {
      throw err;
    }
  }

  async _delteUserProejct(id) {
    try {
      await this.editorProejctRepository.delete({
        editor: id,
      });
    } catch (err) {
      throw err;
    }
  }

  async find(id, projectId): Promise<any> {
    try {
      return await this.editorProejctRepository.findOne({
        where: { editor: { id: id }, project: { id: projectId } },
      });
    } catch (err) {
      throw err;
    }
  }

  async findPorject(projectId): Promise<any> {
    try {
      const userEditorIds = await this.editorProejctRepository
        .createQueryBuilder("projectEditor")
        .leftJoinAndSelect("projectEditor.editor", "editor")
        .where("projectEditor.project.id = :projectId", { projectId })

        .getMany();

      const userIDs = userEditorIds.map(
        (projectEditor) => projectEditor.editor.id
      );

      return userIDs;
      // return userEditorIds.map((editor) => editor.id);
    } catch (err) {
      throw err;
    }
  }
}
