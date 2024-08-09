import { Repository } from "typeorm";
import { ProjectStatus } from "../entities/index";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not } from "typeorm";

export class ProjectStatusRepository {
  constructor(
    @InjectRepository(ProjectStatus)
    private readonly projectStatusRepository: Repository<ProjectStatus>
  ) {}
  async checkExistingStatus() {
    const status = [
      "Brief",
      "B Rolls",
      "Talent",
      "Editing",
      "Initial Review",
      "Final Review",
    ];
    return status;
  }
  async _createProjectStatus(projectData, selectedStatus) {
    const status = [
      { name: "Initial Review", selected: false },
      { name: "Brief", selected: false },
      { name: "B Rolls", selected: false },
      { name: "Talent", selected: false },
      { name: "Editing", selected: false },
      { name: "Final Review", selected: false },
    ];
    const index = status.findIndex((item) => item.name === selectedStatus);
    const projectStatuses = [];
    let i = 0;

    for (const statusItem of status) {
      const projectStatus = new ProjectStatus();
      projectStatus.name = statusItem.name;
      projectStatus.project = projectData;

      if (statusItem.name === selectedStatus) {
        projectStatus.endDate = null;
        projectStatus.startDate = new Date();
        projectStatus.status = false;
      } else if (i > index) {
        projectStatus.endDate = null;
        projectStatus.status = false;
        projectStatus.startDate = null;
      } else {
        projectStatus.endDate = new Date();
        projectStatus.startDate = new Date();
        projectStatus.status = true;
      }
      i++;

      projectStatuses.push(projectStatus);
    }

    await this.projectStatusRepository.save(projectStatuses);
  }

  async updateProjectStatus(statu) {
    let i = 0;
    const status = [
      { name: "Initial Review", selected: false },
      { name: "Brief", selected: false },
      { name: "B Rolls", selected: false },
      { name: "Talent", selected: false },
      { name: "Editing", selected: false },
      { name: "Final Review", selected: false },
    ];
    const index = status.findIndex((item) => item.name === statu.name);
    for (const statusItem of status) {
      const projectStatus = new ProjectStatus();
      if (i === index && index != 0) {
        await this.projectStatusRepository.update(
          { project: { id: statu.id }, name: status[i - 1].name },
          { endDate: new Date(), status: true }
        );
        await this.projectStatusRepository.update(
          {
            project: { id: statu.id },
            name: status[i - 1].name,
            startDate: IsNull(),
          },
          { startDate: new Date() }
        );
      } else if (i > index) {
        await this.projectStatusRepository.update(
          { project: { id: statu.id }, name: statusItem.name },
          { startDate: null, endDate: null, status: false }
        );
      } else {
        await this.projectStatusRepository.update(
          {
            project: { id: statu.id },
            name: statusItem.name,
            startDate: IsNull(),
          },
          { startDate: new Date(), status: false }
        );

        await this.projectStatusRepository.update(
          {
            project: { id: statu.id },
            name: statusItem.name,
            endDate: IsNull(),
          },
          { endDate: new Date(), status: true }
        );
      }
      i++;
    }

    await this.projectStatusRepository.update(
      { project: { id: statu.id }, name: statu.name },
      { startDate: new Date(), endDate: null, status: false }
    );
  }
  async _projctSatusDelete(id) {
    await this.projectStatusRepository.delete({ project: { id } });
  }
  async _updateProjectStatus(projectStatus): Promise<any> {
    for (const status of projectStatus) {
      await this.projectStatusRepository.update(status.id, status);
    }
    return true;
  }

  async countStatus(): Promise<any> {
    return await this.projectStatusRepository.count({
      where: {
        endDate: Not(IsNull()),
        name: "Final Review",
      },
    });
  }
  async updateFinalReview(statu) {
    await this.projectStatusRepository.update(
      { project: { id: statu.id }, name: "Final Review" },
      { endDate: new Date(), status: true }
    );
  }

  async updateFinalReviews(statu) {
    await this.projectStatusRepository.update(
      { project: { id: statu.id }, name: "Final Review", endDate: IsNull() },
      { endDate: new Date(), status: true }
    );
  }
}
