import { Injectable, forwardRef, Inject } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import {
  ProjectCreateDto,
  ProjectOrderChangeDto,
  ProjectUpdatedDto,
} from "./../dto";
import { Repository, Like } from "typeorm";
import { MoreThan } from "typeorm";
import { Project, ProjectOrdering } from "src/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectStatusRepository } from "./projectStatus.repository";
import { IsNull, Not, LessThan, Raw, In } from "typeorm";
import { NotificationsService } from "src/notification/notifications.service";
import { ProjectStatusLogRepository } from "./projectStatusLog.repository";
import { ProjectEditingStatusRepository } from "./projectEditingStatus.repository";
import { ProjectOtherStatusRepository } from "./projectOtherStatus.repository";
import { ClientProjectEditingStatusRepository } from "./clientProjectEditingStatus.repository";
import { ClientOtherStatusRepository } from "./clientProjectOtherStatus.repository";
import { CommentService } from "src/comment/comment.service";
import { EditorProejctRepository } from "./editorProject.repository";
import { SocketGateway } from "src/socket/socket.gateway";
import { CompanyService } from "src/company/company.service";
import { SocketService } from "src/socket/socket.service";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(ProjectOrdering)
    private readonly projectOrdering: Repository<ProjectOrdering>,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    // private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
    private readonly projectStatusRepository: ProjectStatusRepository,
    private readonly projectStatusLogRepository: ProjectStatusLogRepository,
    private readonly projectEditingStatusRepository: ProjectEditingStatusRepository,
    private readonly projectOtherStatusRepository: ProjectOtherStatusRepository,
    private readonly clientProjectEditingStatusRepository: ClientProjectEditingStatusRepository,
    private readonly clientOtherStatusRepository: ClientOtherStatusRepository,
    private readonly editorProejctRepository: EditorProejctRepository,
    private readonly companyService: CompanyService // @Inject("SocketGateway") private socketGateway: SocketGateway
  ) {}

  async createProject(projectCreateDto: ProjectCreateDto, req): Promise<any> {
    let notificationEdtitorList = [];
    try {
      console.log("start", projectCreateDto, "end");
      const project = new Project();
      project.projectName = projectCreateDto.projectName;
      project.talentName = projectCreateDto.talentName;
      project.briefLink = projectCreateDto.briefLink;
      project.videoFolderName = projectCreateDto.videoFolderName;
      project.talentFootageLink = projectCreateDto.talentFootageLink;
      project.completionDate = projectCreateDto.completionDate;
      project.priority = projectCreateDto.priority;
      project.projectType = projectCreateDto.projectType;
      project.createdDate = projectCreateDto.createdDate;
      project.currentStatus = projectCreateDto.status;
      project.finalFolder = projectCreateDto.finalFolder;
      project.currentStage = projectCreateDto.currentStage;
      const user = await this.userService._findUser("id", req.userId);
      project.admin = user;
      if (projectCreateDto.companyId)
        project.company = await this.companyService.findOne(
          projectCreateDto.companyId
        );
      else project.company = null;
      if (
        projectCreateDto.status == "Completed" ||
        projectCreateDto.status == "Approved"
      ) {
        project.completed = true;
      }
      const projectData = await this.projectRepository.save(project);
      const projectOrderData = await this.projectOrdering.find();

      if (projectOrderData.length > 0)
        projectCreateDto.projectOrder = projectOrderData[0].projectOrder;
      else projectCreateDto.projectOrder = [];

      let updatedArray = [];
      if (!projectCreateDto.location && projectCreateDto.location != 0) {
        updatedArray = [...projectCreateDto.projectOrder, projectData.id];
      } else {
        updatedArray = [
          ...projectCreateDto.projectOrder.slice(0, projectCreateDto.location),
          projectData.id,
          ...projectCreateDto.projectOrder.slice(projectCreateDto.location),
        ];
      }
      updatedArray = await this.comapareOrderList(
        updatedArray,
        await this.getproject()
      );

      if (projectOrderData.length > 0) {
        await this.projectOrdering.update(
          { id: projectOrderData[0].id },
          { projectOrder: updatedArray }
        );
      } else {
        updatedArray = [
          ...projectCreateDto.projectOrder,
          ...updatedArray,
          projectData.id,
        ];
        const newOrderproejct = await this.projectOrdering.create({
          projectOrder: updatedArray,
        });
        await this.projectOrdering.save(newOrderproejct);
      }
      if (projectCreateDto.editorId && projectCreateDto.editorId.length > 0) {
        await this.editorProejctRepository._creatEditorProject(
          projectData,
          projectCreateDto.editorId
        );
      }
      const commentsData = {
        projectId: project.id,
        commentText: projectCreateDto.comment,
      };
      await this.commentService.createComment(commentsData);
      if (projectCreateDto.projectType == "Video Editing") {
        await this.projectEditingStatusRepository._createProjectStatus(
          projectData,
          projectCreateDto.status
        );

        await this.clientProjectEditingStatusRepository._createProjectStatus(
          projectData,
          projectCreateDto.status
        );
      } else {
        await this.projectOtherStatusRepository._createProjectStatus(
          projectData,
          projectCreateDto.status
        );
        await this.clientOtherStatusRepository._createProjectStatus(
          projectData,
          projectCreateDto.status
        );
      }
      const title = `New Project Assign`;
      if (!projectCreateDto.projectName) {
        projectCreateDto.projectName = `Project ID # ${project.id}`;
      }
      const body = `You have been assigned to a new project: ${projectCreateDto.projectName}`;
      if (projectCreateDto.editorId && projectCreateDto.editorId.length > 0) {
        for (let i = 0; i < projectCreateDto.editorId.length; i++) {
          const editor = await this.userService._findUser(
            "id",
            String(projectCreateDto.editorId[i])
          );
          if (editor) {
            const resultNotifaction =
              await this.notificationsService.sendPushNotification(
                editor.fcm_token,
                title,
                body,
                editor,
                projectData.id
              );
            if (resultNotifaction) {
              notificationEdtitorList.push(editor.id);
            }
          }
        }
      }
      //res.json({ status: true, message: "Project Add successfully" });
      // this.socketGateway.handleMessage(
      //   await this.findAllProject(),
      //   await this.projectMaxId(),
      //   await this.projectOrderData()
      // );
      if (notificationEdtitorList.length > 0)
        await this.notificationsService.sendNotifaction(
          notificationEdtitorList
        );
      return {
        status: true,
        message: "Project Add successfully",
        data: await this.findProject(project.id),
        maxId: await this.projectMaxId(),
        projectOrder: await this.projectOrderData(),
      };
    } catch (err) {
      return { status: false, message: err.message };
    }
  }
  async assignRoel(role): Promise<any> {
    if (role == "admin") {
      return "admin";
    } else if (role == "editor") {
      return "editor";
    } else if (role == "client") {
      return "client";
    }
  }
  async findAll(): Promise<any> {
    // const skip = (page - 1) * limit;
    return await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.statuses", "statuses")
      .leftJoinAndSelect("project.comments", "comments")
      .leftJoinAndSelect("project.client", "client")
      .leftJoinAndSelect("project.editor", "editor")
      .orderBy("statuses.id", "ASC")
      .getMany();
  }

  async findSortByAll(status, name, sortBy, userRole, userId): Promise<any> {
    // const tasData = await this.projectStatusLogRepository.find();
    // console.log("tas", tasData);
    // const tasProjectdata = tasData;
    // for (let l = 0; l < tasData.length; l++) {
    //   const a = await this.projectRepository.findOne({
    //     where: { id: tasData[l].projectId },
    //   });
    //   tasProjectdata[l].projectName = a.projectName;
    //   console.log(a);
    // }

    // return tasProjectdata;
    const query = this.projectRepository
      .createQueryBuilder("project")
      // .leftJoinAndSelect("project.editingStatuses", "editingStatuse")
      // .leftJoinAndSelect("project.otherStatuses", "otherStatuses")
      .leftJoinAndSelect("project.clientOtherStatuses", "clientOtherStatuses")
      .leftJoinAndSelect(
        "project.clientEditingStatuses",
        "clientEditingStatuses"
      )
      .leftJoinAndSelect("project.comments", "comments")
      .leftJoinAndSelect("project.company", "company")
      .leftJoinAndSelect("company.users", "users")
      .leftJoinAndSelect("project.projectEditors", "projectEditors")
      .leftJoinAndSelect("projectEditors.editor", "editors")
      .andWhere("project.userActiveProject = :userActiveProject", {
        userActiveProject: true,
      });

    if (!status || (status && userRole !== "client")) {
      query.andWhere("project.hide = :hide", { hide: false });
    }

    if (status && userRole === "client") {
      query
        .innerJoin("project.company", "project_company")
        .leftJoin("project_company.users", "company_users")
        .where("company_users.id = :userId", { userId })
        .andWhere("project.hide = :hide", { hide: false });
    } else if (status) {
      const condition =
        userRole === "admin" ? "editor.id = :id" : `${userRole}.id = :id`;
      query.andWhere(condition, { id: userId });
    }

    if (name) {
      query.andWhere("project.projectName ILIKE :name", { name: `%${name}%` });
    }

    if (sortBy) {
      if (sortBy === "Brand") {
        query.addOrderBy("client.name", "ASC");
      } else if (sortBy === "Deadline") {
        query.addOrderBy(
          "DATE_PART('day', project.completionDate - project.createdDate)",
          "DESC"
        );
      } else if (sortBy === "Date Created") {
        query.addOrderBy("project.createdDate", "ASC");
      }
    } else {
      // Specify all sorting criteria for the default case
      query
        // .addOrderBy("editingStatuse.id", "ASC")
        // .addOrderBy("otherStatuses.id", "ASC")

        .addOrderBy("comments.id", "DESC")
        .addOrderBy("clientOtherStatuses.id", "ASC")
        .addOrderBy("clientEditingStatuses.id", "ASC")
        .addOrderBy("editors.name", "DESC");
    }

    const projects = await query.getMany();

    const modifiedProjects = projects.map((project: Project) => {
      const modifiedEditors = project.projectEditors.map(
        (editorObj: any) => editorObj.editor
      );
      return { ...project, projectEditors: modifiedEditors };
    });

    return modifiedProjects;
  }
  async findAllProject(): Promise<any> {
    try {
      const query = this.projectRepository
        .createQueryBuilder("project")
        .leftJoinAndSelect("project.clientOtherStatuses", "clientOtherStatuses")
        .leftJoinAndSelect(
          "project.clientEditingStatuses",
          "clientEditingStatuses"
        )
        .leftJoinAndSelect("project.comments", "comments")
        .leftJoinAndSelect("project.company", "company")
        .leftJoinAndSelect("company.users", "users")
        .leftJoinAndSelect("project.projectEditors", "projectEditors")
        .leftJoinAndSelect("projectEditors.editor", "editors")
        .andWhere("project.userActiveProject = :userActiveProject", {
          userActiveProject: true,
        });
      query.andWhere("project.hide = :hide", { hide: false });

      // Specify all sorting criteria for the default case
      query

        .addOrderBy("comments.id", "DESC")
        .addOrderBy("clientOtherStatuses.id", "ASC")
        .addOrderBy("clientEditingStatuses.id", "ASC")
        .addOrderBy("editors.name", "DESC");

      const projects = await query.getMany();

      const modifiedProjects = projects.map((project: Project) => {
        const modifiedEditors = project.projectEditors.map(
          (editorObj: any) => editorObj.editor
        );
        return { ...project, projectEditors: modifiedEditors };
      });

      return modifiedProjects;
    } catch (err) {
      throw err;
    }
  }
  async findProject(projectId): Promise<any> {
    const query = this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.clientOtherStatuses", "clientOtherStatuses")
      .leftJoinAndSelect(
        "project.clientEditingStatuses",
        "clientEditingStatuses"
      )
      .leftJoinAndSelect("project.comments", "comments")
      .leftJoinAndSelect("project.company", "company")
      .leftJoinAndSelect("company.users", "users")
      .leftJoinAndSelect("project.projectEditors", "projectEditors")
      .leftJoinAndSelect("projectEditors.editor", "editors")
      .andWhere("project.id = :id", {
        id: projectId,
      });
    query.andWhere("project.hide = :hide", { hide: false });

    // Specify all sorting criteria for the default case
    query

      .addOrderBy("comments.id", "DESC")
      .addOrderBy("clientOtherStatuses.id", "ASC")
      .addOrderBy("clientEditingStatuses.id", "ASC")
      .addOrderBy("editors.name", "DESC");
    const project = await query.getOne();

    if (project) {
      // Modify the projectEditors array directly
      project.projectEditors = project.projectEditors.map(
        (editorObj: any) => editorObj.editor
      );

      return project;
    } else {
      // Handle the case where the project is not found
      return null;
    }
  }

  // async findSortByAll(status, name, sortBy, userRole, userId): Promise<any> {
  //   let query = this.projectRepository
  //     .createQueryBuilder("project")
  //     .leftJoinAndSelect("project.editingStatuses", "editingStatuses")
  //     .leftJoinAndSelect("project.otherStatuses", "otherStatuses")
  //     .leftJoinAndSelect("project.clientOtherStatuses", "clientOtherStatuses")
  //     .leftJoinAndSelect(
  //       "project.clientEditingStatuses",
  //       "clientEditingStatuses"
  //     )
  //     .leftJoinAndSelect("project.statuses", "statuses")
  //     .leftJoinAndSelect("project.comments", "comments")
  //     // .leftJoinAndSelect("project.client", "client")
  //     // .leftJoinAndSelect("project.editor", "editor")
  //     .leftJoinAndSelect("project.company", "company")
  //     .leftJoinAndSelect("company.users", "users")
  //     .leftJoinAndSelect("project.projectEditors", "projectEditors")
  //     .leftJoinAndSelect("projectEditors.editor", "editors")
  //     .andWhere("project.userActiveProject = :userActiveProject", {
  //       userActiveProject: true,
  //     });

  //   if (!status) {
  //     query = query.andWhere("project.hide = :hide", { hide: false });
  //   } else if (status && userRole != "client") {
  //     query = query.andWhere("project.hide = :hide", { hide: false });
  //   }
  //   if (status) {
  //     let condition = `${userRole}.id = :id`;
  //     let parameters = { id: userId };
  //     if (userRole === "admin") {
  //       condition = "editor.id=:id";
  //       query = query.andWhere(condition, parameters);
  //     } else if (userRole == "client") {
  //       console.log("here");
  //       query = query
  //         .innerJoin("project.company", "project_company") // Rename the first join to "project_company"
  //         .leftJoin("project_company.users", "company_users") // Left join to the users associated with the company
  //         .where("company_users.id = :userId", { userId })
  //         .andWhere("project.hide = :hide", { hide: false });
  //     } else {
  //       query = query.andWhere(condition, parameters);
  //     }
  //   }

  //   if (name) {
  //     query = query.andWhere("project.projectName ILIKE :name", {
  //       name: `%${name}%`,
  //     });
  //   }

  //   if (sortBy) {
  //     if (sortBy == "Brand") {
  //       query = query.orderBy("client.name", "ASC");
  //     } else if (sortBy == "Deadline") {
  //       query = query.addOrderBy(
  //         "DATE_PART('day', project.completionDate - project.createdDate)",
  //         "DESC"
  //       );
  //     }
  //   } else {
  //     query = query.orderBy("statuses.id", "ASC");
  //     query = query.orderBy("editingStatuses.id", "ASC");
  //     query = query.orderBy("otherStatuses.id", "ASC");
  //   }
  //   query = query
  //     .orderBy("clientOtherStatuses.id", "ASC")
  //     .orderBy("clientEditingStatuses.id", "ASC")
  //     .orderBy("project.order", "ASC");

  //   // Retrieve all data if no filters or sorting provided
  //   // if (!status && !name && !sortBy) {
  //   //   return await query.getMany();
  //   // }

  //   const projects = await query.getMany();
  //   if (projects && projects.length > 0) {
  //     projects.forEach((project: Project) => {
  //       project.clientEditingStatuses.sort((a, b) => a.id - b.id);
  //     });

  //     projects.forEach((project: Project) => {
  //       project.clientOtherStatuses.sort((a, b) => a.id - b.id);
  //     });

  //     if (sortBy && sortBy == "Date Created") {
  //       projects.sort((a: Project, b: Project) => {
  //         const dateA = new Date(a.createdDate).getTime();
  //         const dateB = new Date(b.createdDate).getTime();
  //         return dateA - dateB;
  //       });
  //     }
  //     // projects.forEach((project: Project) => {
  //     //   console.log(project.company.users.map((users) => users.id));
  //     // });

  //     const modifiedProjects = projects.map((project: Project) => {
  //       const modifiedEditors = project.projectEditors.map(
  //         (editorObj: any) => editorObj.editor
  //       );
  //       return { ...project, projectEditors: modifiedEditors };
  //     });

  //     return modifiedProjects;
  //   }

  //   return projects;
  // }

  async _findProject(projectId): Promise<any> {
    return this.projectRepository.findOne({
      where: { id: projectId },
    });
  }

  async remove(ids, projectOrder, userId): Promise<any> {
    try {
      // await this.projectStatusRepository._projctSatusDelete(id);
      // await this.projectEditingStatusRepository.delete(id);
      // await this.projectOtherStatusRepository.delete(id);
      // await this.clientOtherStatusRepository.delete(id);
      // await this.clientProjectEditingStatusRepository.delete(id);

      for (let i = 0; i < ids.length; i++) {
        await this.notificationsService.notificationHide(ids[i], true);
        const result = await this.projectRepository.update(
          { id: ids[i] },
          { hide: true }
        );
        await this.projectStatusLogRepository.deleteProjectLog(
          ids[i],
          userId,
          "project delete"
        );
      }
      const projectOrderChangeDto = { projectOrder: projectOrder };

      await this.projectOrderChnage(projectOrderChangeDto);
      return { status: true, message: "Project Soft Delete successfully" };
      //res.json({ status: true, message: "Project Soft Delete successfully" });
      // await this.socketGateway.handleMessage(
      //   await this.findAllProject(),
      //   await this.projectMaxId(),
      //   await this.projectOrderData()
      // );
    } catch (err) {
      throw err;
    }
  }
  async update(
    id: number,
    projectCreateDto: ProjectCreateDto,
    userId
  ): Promise<any> {
    try {
      let notificationEdtitorList = [];
      const project = await this.projectRepository.findOne({ where: { id } });

      if (project) {
        await this.projectStatusLogRepository.deleteProjectLog(
          id,
          userId,
          "project-update"
        );
        project.projectName = projectCreateDto.projectName;
        if (
          project &&
          projectCreateDto.editorId &&
          projectCreateDto.editorId.length > 0
        ) {
          for (let i = 0; i < projectCreateDto.editorId.length; i++) {
            const editorExsist = await this.editorProejctRepository.find(
              projectCreateDto.editorId[i],
              project.id
            );
            if (!editorExsist) {
              const editor = await this.userService._findUser(
                "id",
                String(projectCreateDto.editorId[i])
              );
              if (!projectCreateDto.projectName)
                projectCreateDto.projectName = `Project ID #${project.id}`;

              const title = `New Project Assign`;
              if (!projectCreateDto.projectName) {
                projectCreateDto.projectName = `Project ID # ${project.id}`;
              }
              const body = `You have been assigned to a new project: ${projectCreateDto.projectName}`;
              if (editor) {
                const resultNotifaction =
                  await this.notificationsService.sendPushNotification(
                    editor.fcm_token,
                    title,
                    body,
                    editor,
                    project.id
                  );
                if (resultNotifaction) {
                  notificationEdtitorList.push(editor.id);
                }
              }
            }
          }
        }
        await this.editorProejctRepository._update(
          project,
          projectCreateDto.editorId
        );
        if (projectCreateDto.companyId) {
          project.company = await this.companyService.findOne(
            projectCreateDto.companyId
          );
        } else project.company = null;

        project.briefLink = projectCreateDto.briefLink;
        project.videoFolderName = projectCreateDto.videoFolderName;
        project.talentFootageLink = projectCreateDto.talentFootageLink;
        project.completionDate = projectCreateDto.completionDate;
        project.priority = projectCreateDto.priority;
        project.projectType = projectCreateDto.projectType;
        project.createdDate = projectCreateDto.createdDate;
        project.currentStatus = projectCreateDto.status;
        project.talentName = projectCreateDto.talentName;
        project.finalFolder = projectCreateDto.finalFolder;
        project.currentStage = projectCreateDto.currentStage;
        project.updatedBy = userId;
        await this.commentService.updateComment(
          projectCreateDto.comment,
          project.id
        );

        const projectStatus = {
          projectType: projectCreateDto.projectType,
          id: id,
          name: projectCreateDto.status,
        };
        await this.updateProjectStatus(
          projectStatus,
          userId,
          true,
          projectCreateDto.status
        );

        await this.projectRepository.save(project);
        //res.json({ status: true, message: "Project updated successfully" });
        if (notificationEdtitorList.length > 0)
          await this.notificationsService.sendNotifaction(
            notificationEdtitorList
          );
        return { status: true, message: "Project updated successfully" };
        // await this.socketGateway.handleMessage(
        //   await this.findAllProject(),
        //   await this.projectMaxId(),
        //   await this.projectOrderData()
        // );
      } else {
        throw new Error("Project not found");
      }
    } catch (err) {
      console.log(err);
    }
  }
  async searchProjectByName(name, userId, userRole): Promise<any> {
    return await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.statuses", "statuses")
      .leftJoinAndSelect("project.comments", "comments")
      .leftJoinAndSelect("project.client", "client")
      .leftJoinAndSelect("project.editor", "editor")
      .where("project.projectName LIKE :name", { name: `%${name}%` })
      .orderBy("project.id", "ASC")
      .getMany();
  }
  async getprojectByBrand(userId, brandId, userRole): Promise<any> {
    return await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.statuses", "statuses")
      .leftJoinAndSelect("project.comments", "comments")
      .leftJoinAndSelect("project.client", "client")
      .leftJoinAndSelect("project.editor", "editor")
      .where("project.brandId  :brandId", { brandId: `${brandId}` })
      .orderBy("project.id", "ASC");
  }
  async getLoginUserProjectSortBy(userId, userRole, sortBy): Promise<any> {
    let condition = `${userRole}.id = :id`;
    let parameters = { id: userId };
    return await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.statuses", "statuses")
      .leftJoinAndSelect("project.comments", "comments")
      .leftJoinAndSelect("project.client", "client")
      .leftJoinAndSelect("project.editor", "editor")
      .leftJoin(`project.${userRole}`, userRole)
      .where(condition, parameters)
      .orderBy("project.projectName", sortBy)
      .getMany();
  }

  async updateProjectStatus(status, userId, res?, currentStatus?) {
    let notificationEdtitorList = [];
    try {
      const project = await this.projectRepository.findOne({
        where: { id: status.id },
      });

      if (project) {
        const projectEditor = await this.editorProejctRepository.findPorject(
          project.id
        );

        if (projectEditor.length > 0)
          for (let i = 0; i < projectEditor.length; i++) {
            const editor = await this.userService._findUser(
              "id",
              String(projectEditor[i])
            );
            if (!project.projectName)
              project.projectName = `Project ID #${project.id}`;

            const title = `Project Status Changed`;

            const body = `The status of your assigned project ${project.projectName}, has been changed`;
            if (editor)
              if (currentStatus && currentStatus != project.currentStatus) {
                const resultNotifaction =
                  await this.notificationsService.sendPushNotification(
                    editor.fcm_token,
                    title,
                    body,
                    editor,
                    project.id
                  );
                if (resultNotifaction) {
                  notificationEdtitorList.push(editor.id);
                }
              } else if (!currentStatus) {
                const resultNotifaction =
                  await this.notificationsService.sendPushNotification(
                    editor.fcm_token,
                    title,
                    body,
                    editor,
                    project.id
                  );
                if (resultNotifaction) {
                  notificationEdtitorList.push(editor.id);
                }
              }
          }
      }

      await this.projectStatusLogRepository.chanheProjectStatusLog(
        project,
        status,
        userId
      );
      // await this.projectStatusRepository.updateProjectStatus(status);

      if (status.name == "Completed" || status.name == "Approved")
        await this.projectRepository.update(
          { id: status.id },
          { currentStatus: status.name, completed: true }
        );
      else
        await this.projectRepository.update(
          { id: status.id },
          { currentStatus: status.name, completed: false }
        );

      if (status.projectType == "Video Editing") {
        // const currentStage = await this.checkStagesOfClint(status);
        await this.projectRepository.update(
          { id: status.id },
          { currentStage: status.name }
        );
        await this.projectEditingStatusRepository.updateProjectStatus(status);
        status.name = await this.map(status.name);
        {
          await this.clientProjectEditingStatusRepository.updateProjectStatus(
            status
          );
        }
      } else {
        await this.projectRepository.update(
          { id: status.id },
          {
            currentStatus: status.name,
            currentStage: status.name,
          }
        );
        await this.projectOtherStatusRepository.updateProjectStatus(status);
        await this.clientOtherStatusRepository.updateProjectStatus(status);
      }
      if (notificationEdtitorList.length > 0)
        await this.notificationsService.sendNotifaction(
          notificationEdtitorList
        );
      return { status: true, message: "Status Change Successfully" };
      // if (res) {
      //   res.json({ status: true, message: "Status Change Successfully" });
      //   await this.socketGateway.handleMessage(
      //     await this.findAllProject(),
      //     await this.projectMaxId(),
      //     await this.projectOrderData()
      //   );
      // }
    } catch (err) {
      throw err;
    }
  }
  async updateProjectMutipleStatus(status, userId, currentStatus?) {
    let notificationEdtitorList = [];

    try {
      for (let i = 0; i < status.id.length; i++) {
        const project = await this.projectRepository.findOne({
          where: { id: status.id[i] },
        });

        if (project) {
          const projectEditor = await this.editorProejctRepository.findPorject(
            project.id
          );

          if (projectEditor.length > 0)
            for (let i = 0; i < projectEditor.length; i++) {
              const editor = await this.userService._findUser(
                "id",
                String(projectEditor[i])
              );
              if (!project.projectName)
                project.projectName = `Project ID #${project.id}`;

              const title = `Project Status Changed`;

              const body = `The status of your assigned project ${project.projectName}, has been changed`;
              if (editor)
                if (currentStatus && currentStatus != project.currentStatus) {
                  const resultNotifaction =
                    await this.notificationsService.sendPushNotification(
                      editor.fcm_token,
                      title,
                      body,
                      editor,
                      project.id
                    );
                  if (resultNotifaction) {
                    notificationEdtitorList.push(editor.id);
                  }
                } else if (!currentStatus) {
                  const resultNotifaction =
                    await this.notificationsService.sendPushNotification(
                      editor.fcm_token,
                      title,
                      body,
                      editor,
                      project.id
                    );
                  if (resultNotifaction) {
                    notificationEdtitorList.push(editor.id);
                  }
                }
            }
        }

        await this.projectStatusLogRepository.chanheProjectStatusLog(
          project,
          status,
          userId
        );
        // await this.projectStatusRepository.updateProjectStatus(status);

        if (status.name == "Completed" || status.name == "Approved")
          await this.projectRepository.update(
            { id: status.id[i] },
            { currentStatus: status.name, completed: true }
          );
        else
          await this.projectRepository.update(
            { id: status.id[i] },
            { currentStatus: status.name, completed: false }
          );

        if (status.projectType == "Video Editing") {
          // const currentStage = await this.checkStagesOfClint(status);
          await this.projectRepository.update(
            { id: status.id[i] },
            { currentStage: status.name }
          );
          await this.projectEditingStatusRepository.updateProjectStatusMultiple(
            status,
            status.id[i]
          );
          status.name = await this.map(status.name);
          {
            await this.clientProjectEditingStatusRepository.updateProjectStatusMultiple(
              status,
              status.id[i]
            );
          }
        } else {
          await this.projectRepository.update(
            { id: status.id[i] },
            {
              currentStatus: status.name,
              currentStage: status.name,
            }
          );
          await this.projectOtherStatusRepository.updateProjectStatusMutiple(
            status,
            status.id[i]
          );
          await this.clientOtherStatusRepository.updateProjectStatusMultiple(
            status,
            status.id[i]
          );
        }
        if (notificationEdtitorList.length > 0)
          await this.notificationsService.sendNotifaction(
            notificationEdtitorList
          );
      }
      return { status: true, message: "Status Change Successfully" };
    } catch (err) {
      throw err;
    }
  }

  async map(selected) {
    switch (selected) {
      case "Brief":
        return "Brief";
      case "B Rolls":
        return "Brief";
      case "Talent Sourcing":
        return "Talent";
      case "Filming":
        return "Talent";
      case "Editing":
        return "Editing";
      case "Initial Review":
        return "Reviews";
      case "Final Review":
        return "Reviews";
      case "Completed":
        return "Completed";
      case "In Queue":
        return "Editing";
      case "Declined":
        return "Reviews";
      default:
        return "Unknown"; // Handle unrecognized values
    }
    // switch (selected) {
    //   case "Approved":
    //     return "Completed";
    //   case "In Queue":
    //     return "Project Start";
    //   case "Initial Review":
    //     return "Brief";
    //   case "Editing":
    //     return "Talent";
    //   case "Final Review":
    //     return "Review";
    //   case "Revise":
    //     return "Editing";
    //   default:
    //     return "Unknown"; // Handle unrecognized values
    // }
  }
  // async map(selected) {
  //   switch (selected) {
  //     case "Brief":
  //       return "Brief";
  //     case "B Rolls":
  //       return "Brief";
  //     case "Talent Sourcing":
  //       return "Talent";
  //     case "Filming":
  //       return "Talent";
  //     case "Editing":
  //       return "Editing";
  //     case "Initial Review":
  //       return "Editing";
  //     case "Final Review":
  //       return "Reviews";
  //     case "Approved":
  //       return "Completed";
  //     case "In Queue":
  //       return "Project Start";
  //     case "Declined":
  //       return "Reviews";
  //     default:
  //       return "Unknown"; // Handle unrecognized values
  //   }
  //   // switch (selected) {
  //   //   case "Approved":
  //   //     return "Completed";
  //   //   case "In Queue":
  //   //     return "Project Start";
  //   //   case "Initial Review":
  //   //     return "Brief";
  //   //   case "Editing":
  //   //     return "Talent";
  //   //   case "Final Review":
  //   //     return "Review";
  //   //   case "Revise":
  //   //     return "Editing";
  //   //   default:
  //   //     return "Unknown"; // Handle unrecognized values
  //   // }
  // }
  async countStatus(userId, role): Promise<any> {
    let check: string = "admin.id";

    if (role === "client") {
      check = "clientId";
    } else if (role === "editor") {
      check = "editorId";
    }
    const currentDate = new Date();

    // const ongoingProject = await this.projectRepository.count({
    //   where: {
    //     createdDate: Raw((alias) => `${alias} > :currentDate`, {
    //       currentDate,
    //     }),
    //     [check]: userId,
    //   },
    // });

    const ongoingProject = await this.projectRepository.count({
      where: [
        {
          // [check]: userId,
          currentStatus: In([
            "Editing",
            "In Queue",
            "Revise",
            "In Progress",
            "B Rolls",
            "Backlog",
          ]),
          hide: false,
          userActiveProject: true,
        },
      ],
    });
    //123
    const incomingProject = await this.projectRepository.count({
      where: [
        {
          createdDate: MoreThan(currentDate),
          // [check]: userId,
          hide: false,
          userActiveProject: true,
        },
        {
          currentStatus: In(["Brief", "Talent Sourcing"]),
          hide: false,
          userActiveProject: true,
        },
        // {
        //   // [check]: userId,
        //   hide: false,
        //   currentStatus: In(["Brief"]),
        //   userActiveProject: true,
        // },
        // {
        //   // [check]: userId,
        //   hide: false,
        //   currentStatus: In(["Talent Sourcing"]),
        //   userActiveProject: true,
        // },
        // {
        //   // [check]: userId,
        //   hide: false,
        //   currentStatus: In(["Backlog"]),
        //   userActiveProject: true,
        // },
      ],
    });

    const initialReviewProject = await this.projectRepository.count({
      where: [
        {
          currentStatus: In(["Initial Review", "Review"]),
          // [check]: userId,
          hide: false,
          userActiveProject: true,
        },
      ],
    });

    const finalReviewProject = await this.projectRepository.count({
      where: [
        {
          currentStatus: "Final Review",
          // [check]: userId,
          hide: false,
          userActiveProject: true,
        },
        // {
        //   currentStatus: "Review",
        //   // [check]: userId,
        //   hide: false,
        //   userActiveProject: true,
        // },
      ],
    });
    //Backlog  in
    //rev final
    const data = [
      { statusname: "Incoming Project", count: incomingProject },
      { statusname: "Ongoing Project", count: ongoingProject },
      { statusname: "Initial Review", count: initialReviewProject },
      { statusname: "Final Review", count: finalReviewProject },
    ];
    /*

     switch (selected) {
      case "Approved":
        return "Completed";
      case "In Queue":
        return "Project Start";
      case "Initial Review":
        return "Brief";
      case "Editing":
        return "Talent";
      case "Final Review":
        return "Review";
      case "Revise":
        return "Editing";
      default:
        return "Unknown"; // Handle unrecognized values
    }
  }
Incoming Project -->Backlog 
Ongoing Projec-->In progress
Final Review-->Review
Completed 
Ongoing Projec--Declined 

Incoming Project---In qU
Initial Review
Ongoing Project-->Editing
EFinal Review-->Final Review
Ongoing Project-->Revise
Appreoved





*/
    return data;
  }

  async countStatuss(userId, role): Promise<any> {
    let check: string = "editor.id";

    if (role === "client") {
      check = "clientId";
    } else if (role === "editor") {
      check = "editorId";
    }
    if (role == "client") {
      //   const completedCount = await this.projectRepository.query(`
      //   SELECT COUNT(p.id) AS projectCount
      //   FROM project p
      //   INNER JOIN project_client pc ON p.id = pc."projectId"
      //   WHERE pc."clientId" = ${userId}
      //     AND p."hide" = false
      //     AND p."userActiveProject" = true
      //     AND p."completed" = true
      // `);
      const completedCount = await this.projectRepository
        .createQueryBuilder("p")
        .innerJoin("p.company", "company")
        .innerJoin("company.users", "user")
        .where("user.id = :userId", { userId })
        .andWhere("p.hide = :hide", { hide: false })
        .andWhere("p.userActiveProject = :userActiveProject", {
          userActiveProject: true,
        })
        .andWhere("p.completed = :completed", { completed: true })
        .getCount();
      //   const deliveredCount = await this.projectRepository.query(`
      //   SELECT COUNT(p.id) AS projectCount
      //   FROM project p
      //   INNER JOIN project_client pc ON p.id = pc."projectId"
      //   WHERE pc."clientId" = ${userId}
      //     AND p."hide" = false
      //     AND p."userActiveProject" = true
      //     AND p."delivered" = true
      // `);
      const deliveredCount = await this.projectRepository
        .createQueryBuilder("p")
        .innerJoin("p.company", "company")
        .innerJoin("company.users", "user")
        .where("user.id = :userId", { userId })
        .andWhere("p.hide = :hide", { hide: false })
        .andWhere("p.userActiveProject = :userActiveProject", {
          userActiveProject: true,
        })
        .andWhere("p.delivered = :delivered", { delivered: true })
        .getCount();

      //   const statuCount = await this.projectRepository.query(`
      //   SELECT COUNT(p.id) AS projectCount
      //   FROM project p
      //   INNER JOIN project_client pc ON p.id = pc."projectId"
      //   WHERE pc."clientId" = ${userId}
      //     AND p."hide" = false
      //     AND p."userActiveProject" = true
      //     AND p."completed" = false
      //     AND p."delivered" = false

      // `);

      const statuCount = await this.projectRepository
        .createQueryBuilder("p")
        .innerJoin("p.company", "company")
        .innerJoin("company.users", "user")
        .where("user.id = :userId", { userId })
        .andWhere("p.hide = :hide", { hide: false })
        .andWhere("p.userActiveProject = :userActiveProject", {
          userActiveProject: true,
        })
        .andWhere("p.delivered = :delivered", { delivered: false })

        .andWhere("p.completed = :completed", { completed: false })
        .getCount();

      const data = [
        {
          statusname: "completed",
          count: Number(completedCount),
        },
        {
          statusname: "delivered",
          count: Number(deliveredCount),
        },
        {
          statusname: "Runing Project",
          count: Number(statuCount),
        },
        {
          statusname: "In progress Projects",
          count: Number(statuCount),
        },
      ];
      return data;
    } else {
      const completedCount = await this.projectRepository.count({
        where: {
          completed: true,
          hide: false,
          userActiveProject: true,
          [check]: userId,
        },
      });

      const deliveredCount = await this.projectRepository.count({
        where: {
          delivered: true,
          hide: false,
          userActiveProject: true,
          [check]: userId,
        },
      });

      const statuCount = await this.projectRepository.count({
        where: {
          delivered: false,
          completed: false,
          hide: false,
          userActiveProject: true,
          [check]: userId,
        },
      });
      const data = [
        { statusname: "completed", count: completedCount },
        { statusname: "delivered", count: deliveredCount },
        { statusname: "Runing Project", count: statuCount },
        { statusname: "In progress Projects", count: statuCount },
      ];
      return data;
    }
  }
  async updateStatuses(data): Promise<any> {
    if (data.name == "completed") {
      await this.projectRepository.update({ id: data.id }, { completed: true });
      await this.projectStatusRepository.updateFinalReview(data);
    } else if ((data.name = "delivered")) {
      await this.projectStatusRepository.updateFinalReviews(data);
      await this.projectRepository.update({ id: data.id }, { delivered: true });
    }
    return { status: true, message: "Status Update successfully" };
  }

  async updateStages(status, userId) {
    let completed = false;
    if (status.name == "Completed") {
      completed = true;
    }
    await this.projectRepository.update(
      { id: status.id },
      { currentStage: status.name, completed: completed }
    );
    // const stage = await this.checkStages(status);
    // status.name = stage;
    await this.updateProjectStage(status, userId);
    return { status: true, message: "Stage Update Successfully" };
  }
  async updateStagesMultiPleProject(status, userId) {
    let completed = false;
    if (status.name == "Completed") {
      completed = true;
    }
    await this.projectRepository.update(
      { id: In(status.id) },
      { currentStage: status.name, completed: completed }
    );
    // const stage = await this.checkStages(status);
    // status.name = stage;
    for (let i = 0; i < status.length; i++) {
      await this.updateProjectStage(status, userId);
    }
    return { status: true, message: "Stage Update Successfully" };
  }
  //issues
  async checkStages(status) {
    status = status.name;
    // if (
    //   status === "Brief" ||
    //   status === "B Rolls" ||
    //   status === "Talent Sourcing"
    // ) {
    //   return "Initial Review";
    // } else if (status === "Filming" || status === "Editing") {
    //   return "Editing";
    // } else if (status === "Reviews") {
    //   return "Final Review";
    // } else if (status == "Declined") return "Revise";
    // else if (status == "Completed") return "Approved";

    if (status === "Brief") return "Brief";
    else if (status === "B Rolls") return "B Rolls";
    else if (status === "Talent Sourcing") return "Talent Sourcing";
    else if (status === "Filming") return "Filming";
    else if (status === "Editing") return "Editing";
    else if (status === "Reviews") return "Initial Review";
    else if (status === "Completed") return "Approved";
    else if (status === "Declined") return "Declined";
  }

  async checkStagesOfClint(status) {
    status = status.name;
    if (status === "Brief") return "Brief";
    else if (status === "In Queue") return "Editing";
    else if (status === "B Rolls") return "B Rolls";
    else if (status === "Talent Sourcing") return "Talent Sourcing";
    else if (status === "Filming") return "Filming";
    else if (status === "Editing") return "Editing";
    else if (status === "Initial Review" || status === "Final Review")
      return "Reviews";
    else if (status === "Approved") return "Completed";
    else if (status === "Declined") return "Declined";
    // status = status.name;
    // if (status === "Initial Review") {
    //   return "Brief";
    // } else if (status === "Editing") {
    //   return "B Rolls";
    // } else if (status === "Final Review") {
    //   return "Reviews";
    // } else if (status === "Revise") return "Declined";
    // else if (status === "Approved") return "Completed";
  }

  async updateProjectStage(status, userId) {
    const project = await this.projectRepository.findOne({
      where: { id: status.id },
    });

    await this.projectStatusLogRepository.chanheProjectStatusLog(
      project,
      status,
      userId
    );
    // await this.projectStatusRepository.updateProjectStatus(status);

    // const currentStage = await this.checkStagesOfClint(status);
    let delivered = false;
    let completed = false;
    if (status.name == "Completed" || status.name == "Approved") {
      // delivered = true;
      completed = true;
    }
    await this.projectRepository.update(
      { id: status.id },
      { currentStatus: status.name, delivered: delivered, completed: completed }
    );
    await this.projectEditingStatusRepository.updateProjectStatus(status);
    status.name = await this.map(status.name);
    {
      await this.clientProjectEditingStatusRepository.updateProjectStatus(
        status
      );
    }
  }

  async _findProjects(fieldName, id): Promise<any> {
    return await this.projectRepository.find({
      where: {
        [fieldName]: id,
      },
    });
  }
  async _clientProjects(fieldName, id): Promise<any> {
    const projects = await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.projectClients", "clients")
      .andWhere("clients.clientId = :clientId", { clientId: id })
      .getMany();
    return projects;
  }
  async _changeEditor(updateProjectEditorDto): Promise<any> {
    const projectData = { id: updateProjectEditorDto.projectId };
    const editors = updateProjectEditorDto.editorId;
    await this.editorProejctRepository._update(projectData, editors);
  }

  async projectHide(projectHideDto): Promise<any> {
    if (projectHideDto.hide) projectHideDto.hide = false;
    else projectHideDto.hide = true;

    await this.projectRepository.update(
      { id: projectHideDto.projectId },
      { hide: projectHideDto.hide }
    );
    await this.notificationsService.notificationHide(
      projectHideDto.projectId,
      projectHideDto.hide
    );
    return {
      status: true,
      message: "Project  Update Successfully",
    };
  }

  async _unassignProejctToUser(user): Promise<any> {
    try {
      if (user.role == "editor") {
        await this.projectRepository.update(
          {
            editor: { id: user.id },
          },
          { editor: null, editorId: null }
        );

        await this.projectRepository
          .createQueryBuilder("project")
          .update(Project)
          .set({
            editorId: null,
            editor: null,
          })
          .where("editorId = :editorId", { editorId: user.id })
          .execute();

        await this.editorProejctRepository._delteUserProejct(user.id);
      } else if (user.role == "client") {
        await this.projectRepository.update(
          { clientId: user.id },
          { clientId: null, client: null }
        );
        // await this.companyService.delete(user.id);
      } else if (user.role == "admins")
        await this.projectRepository.update(
          {
            admin: { id: user.id },
          },
          { admin: null }
        );
      await this.projectRepository.update(
        {
          admin: { id: user.id },
        },
        { admin: null }
      );

      await this.userService._deleteUsers(user.id);
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  }

  async projectOrderChnage(
    projectOrderChangeDto: ProjectOrderChangeDto
  ): Promise<any> {
    try {
      const projectOrderData = await this.projectOrdering.find();

      if (projectOrderData.length > 0) {
        await this.projectOrdering.update(
          { id: projectOrderData[0].id },
          { projectOrder: projectOrderChangeDto.projectOrder }
        );
      } else {
        const newOrderproejct = await this.projectOrdering.create({
          projectOrder: projectOrderChangeDto.projectOrder,
        });
        await this.projectOrdering.save(newOrderproejct);
      }
      return {
        status: true,
        message: "Project order change successfully",
      };
    } catch (err) {
      throw err;
    }
  }

  // const oldOrderproejct = await this.projectRepository.findOne({
  //   where: {
  //     order: projectOrderChangeDto.oldOrder,
  //   },
  // });
  // console.log(newOrderproejct);
  // console.log(oldOrderproejct);
  // await this.projectRepository.update(
  //   { id: newOrderproejct.id },
  //   { order: projectOrderChangeDto.oldOrder }
  // );
  // await this.projectRepository.update(
  //   { id: oldOrderproejct.id },
  //   { order: projectOrderChangeDto.newOrder }
  // );

  async projectOrderData(): Promise<any> {
    try {
      const projectOrderData = await this.projectOrdering.find();
      if (projectOrderData && projectOrderData.length > 0) {
        return projectOrderData[0].projectOrder;
      } else return [];
    } catch (err) {
      throw err;
    }
  }
  //here
  async projectOrder(project): Promise<any> {
    try {
      const projectOrderdata = await project.map((project) => project.id);
      const projectOrderData = await this.projectOrdering.find();

      if (projectOrderData.length < 1) {
        const newOrderproejct = await this.projectOrdering.create({
          projectOrder: projectOrderdata,
        });

        await this.projectOrdering.save(newOrderproejct);
      } else
        await this,
          this.projectOrdering.update(
            { id: projectOrderData[0].id },
            { projectOrder: projectOrderdata }
          );
      return projectOrderdata;
    } catch (err) {
      throw err;
    }
  }

  async changeProejctOrder(projectOrderChangeDto: any): Promise<any> {
    try {
      const projectdata = {
        id: projectOrderChangeDto.projectId,
      };
      await this.editorProejctRepository._update(
        projectdata,
        projectOrderChangeDto.editorId
      );
      return { status: true, message: "Project editor successfully" };
    } catch (err) {
      throw err;
    }
  }

  async projectMaxId(): Promise<any> {
    try {
      const maxIdObject = await this.projectRepository
        .createQueryBuilder("project")
        .select("MAX(project.id)", "maxId")
        .getRawOne();

      const maxId = maxIdObject.maxId;

      return maxId;
    } catch (error) {
      console.error("Error fetching maximum ID:", error);
    }
  }

  async comapareOrderList(orderList, project): Promise<any> {
    // Create a copy of orderList with only the values that exist in project
    const filteredOrderList = orderList.filter((item) =>
      project.includes(item)
    );

    // Create a copy of project with values that are missing in orderList
    const missingValues = project.filter((item) => !orderList.includes(item));

    // Concatenate the filteredOrderList and missingValues to get the final result
    const result = [...filteredOrderList, ...missingValues];

    return result;
  }
  async getproject(): Promise<any> {
    const projects = await this.projectRepository.find({
      where: { hide: false, userActiveProject: true },
    });

    const projectIds = projects.map((project) => project.id);
    return projectIds;
  }

  async getCompany(email): Promise<any> {
    return await this.userService._findUsers("email", email);
  }
}
