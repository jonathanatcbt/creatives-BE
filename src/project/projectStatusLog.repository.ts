import { Repository } from "typeorm";
import { ProjectStatusLog } from "../entities/index";
import { InjectRepository } from "@nestjs/typeorm";

export class ProjectStatusLogRepository {
  constructor(
    @InjectRepository(ProjectStatusLog)
    private readonly ProjectStatusLogRepository: Repository<ProjectStatusLog>
  ) {}

  async chanheProjectStatusLog(projectData, status, userId) {
    const project = new ProjectStatusLog();
    project.projectId = projectData.id;
    project.currentStage = status.name;
    project.previousStage = projectData.currentStatus;
    project.userId = userId;
    project.module = "status";
    await this.ProjectStatusLogRepository.save(project);
  }
  async delete(id) {
    await this.ProjectStatusLogRepository.delete({ projectId: id });
  }
  async deleteProjectLog(projectId, userId, module) {
    const project = new ProjectStatusLog();
    project.projectId = projectId;
    project.userId = userId;
    project.module = module;
    await this.ProjectStatusLogRepository.save(project);
  }

  async find() {
    // const data = await this.ProjectStatusLogRepository.find({
    //   where: {
    //     userId: 104,
    //     currentStage: "Completed",
    //   },
    // });
    // console.log(data);
    const data = await this.ProjectStatusLogRepository.createQueryBuilder(
      "project_status_log"
    )
      // .select("DISTINCT project_status_log.projectId", "projectId")
      .select(" project_status_log.projectId", "projectId")
      .select("project_status_log.*")

      .where("project_status_log.userId = :userId", { userId: 104 })
      .andWhere("project_status_log.currentStage = :currentStage", {
        currentStage: "Completed",
      })
      // .andWhere("project_status_log.updatedAt >= :startDate", {
      //   startDate: "2023-10-29",
      // })
      .getRawMany();
    let dataa = [];
    for (let k = 0; k < data.length; k++) {
      dataa[k] = await this.ProjectStatusLogRepository.findOne({
        where: { id: data[k].id },
      });
    }
    return dataa;
  }
}
