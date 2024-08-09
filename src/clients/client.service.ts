import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectStatusLog, User } from "src/entities";
import { UserService } from "src/user/user.service";
import { UpdateClientDto, UserDeatilsUpdateDto } from "./../dto";
import { ProjectService } from "src/project/project.service";
import { Repository, IsNull } from "typeorm";
import { SocketGateway } from "src/socket/socket.gateway";
@Injectable()
export class ClientService {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    @InjectRepository(ProjectStatusLog)
    private readonly projectStatusLogRepository: Repository<ProjectStatusLog>,
    private readonly socketGateway: SocketGateway
  ) {}

  async notifactionSend(data): Promise<any> {
    return await this.socketGateway.notifactionList(data);
  }
  async findOne(value: any): Promise<User> {
    return await this.userService._findUser("id", value);
  }
  async findAll(): Promise<any> {
    return await this.userService._findAllUser("role", "client");
  }

  async remove(id): Promise<any> {
    const result = await this.userService._deleteUsers(id);
    if (result.affected === 0) {
      return { status: false, message: "Client not found" };
    }
    return { status: true, message: "Client Delete successfully" };
  }
  async _update(id, updateClientDto: UpdateClientDto): Promise<any> {
    const clientUpdate = await this.userService._updateUsers(
      id,
      updateClientDto
    );
    if (!clientUpdate)
      return {
        status: false,
        message:
          "The provided email is already registered with another client.",
      };
    return { status: true, message: "Client Update successfully" };
  }

  async findClientProject(clientId: any): Promise<any> {
    return await this.projectService._clientProjects("clientId", clientId);
  }
  async _deleteUser(id, userId, res): Promise<any> {
    const user = await this.userService._findUsers("id", id);

    if (user) {
      await this.projectService._unassignProejctToUser(user);
      await this.saveLog(user.id, userId, "user-delete");
      res.json({ status: true, message: "User Delete successfully" });
      let userData;
      // await this.socketGateway.userData(UserData);
      if (user.role === "client") {
        userData = await this.findAll();
        await this.socketGateway.userData(userData, true);
      } else {
        userData = await this.userService.findEditor(1);
        await this.socketGateway.userData(userData, false);
      }
    } else return { status: false, message: "User not found" };
  }
  async saveLog(projectId, userId, module) {
    const project = new ProjectStatusLog();
    project.projectId = projectId;
    project.userId = userId;
    project.module = module;
    await this.projectStatusLogRepository.save(project);
  }
  async updateUserData(
    user: UserDeatilsUpdateDto,
    id,
    userId,
    res
  ): Promise<any> {
    await this.userService.updateUserData(user, id, userId, res);
    const userRole = await this.userService._findUsers("id", id);
    let userData;
    if (userRole.role === "client") {
      userData = await this.findAll();
      await this.socketGateway.userData(userData, true);
    } else {
      userData = await this.userService.findEditor(1);
      await this.socketGateway.userData(userData, false);
    }
  }
  async roleChange(roleChnge, id, res): Promise<any> {
    let userData;
    await this.userService.roleChange(roleChnge, id, res);
    userData = await this.userService.findEditor(1);
    await this.socketGateway.userData(userData, false);
  }
  async updateUser(id, bodyData, userId, res): Promise<any> {
    await this.userService.updateUser(id, bodyData, userId, res);
    const userRole = await this.userService._findUsers("id", id);
    let userData;
    if (userRole.role === "client") {
      userData = await this.findAll();
      await this.socketGateway.userData(userData, true);
    } else {
      userData = await this.userService.findEditor(1);
      await this.socketGateway.userData(userData, false);
    }
  }
}
