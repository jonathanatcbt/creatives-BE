import { Repository } from "typeorm";
import { OtherStatus, ProjectStatus } from "../entities/index";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull } from "typeorm";

export class ProjectOtherStatusRepository {
  constructor(
    @InjectRepository(OtherStatus)
    private readonly projectOtherStatusRepository: Repository<OtherStatus>
  ) {}
  async checkExistingStatus() {
    const status = ["Backlog", "In Progress", "Review", "Completed", "Decling"];
    return status;
  }
  async _createProjectStatus(projectData, selectedStatus) {
    const status = [
      { name: "Backlog", selected: false },
      { name: "In Progress", selected: false },
      { name: "Review", selected: false },
      { name: "Declined", selected: false },
      { name: "Completed", selected: false },
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

    await this.projectOtherStatusRepository.save(projectStatuses);
  }

  async updateProjectStatus(statu) {
    let i = 0;
    const status = [
      { name: "Backlog", selected: false },
      { name: "In Progress", selected: false },
      { name: "Review", selected: false },
      { name: "Declined", selected: false },
      { name: "Completed", selected: false },
    ];
    const index = status.findIndex((item) => item.name === statu.name);

    for (const statusItem of status) {
      const projectStatus = new ProjectStatus();
      if (i === index && index != 0) {
        await this.projectOtherStatusRepository.update(
          { project: { id: statu.id }, name: status[i - 1].name },
          { endDate: new Date(), status: true }
        );
        await this.projectOtherStatusRepository.update(
          {
            project: { id: statu.id },
            name: status[i - 1].name,
            startDate: IsNull(),
          },
          { startDate: new Date() }
        );
      } else if (i > index) {
        await this.projectOtherStatusRepository.update(
          { project: { id: statu.id }, name: statusItem.name },
          { startDate: null, endDate: null, status: false }
        );
      } else {
        await this.projectOtherStatusRepository.update(
          {
            project: { id: statu.id },
            name: statusItem.name,
            startDate: IsNull(),
          },
          { startDate: new Date(), status: false }
        );

        await this.projectOtherStatusRepository.update(
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

    await this.projectOtherStatusRepository.update(
      { project: { id: statu.id }, name: statu.name },
      { startDate: new Date(), endDate: null, status: false }
    );
  }
  //mutiple
  async updateProjectStatusMutiple(statu, id) {
    let i = 0;
    const status = [
      { name: "Backlog", selected: false },
      { name: "In Progress", selected: false },
      { name: "Review", selected: false },
      { name: "Declined", selected: false },
      { name: "Completed", selected: false },
    ];
    const index = status.findIndex((item) => item.name === statu.name);

    for (const statusItem of status) {
      const projectStatus = new ProjectStatus();
      if (i === index && index != 0) {
        await this.projectOtherStatusRepository.update(
          { project: { id: id }, name: status[i - 1].name },
          { endDate: new Date(), status: true }
        );
        await this.projectOtherStatusRepository.update(
          {
            project: { id: id },
            name: status[i - 1].name,
            startDate: IsNull(),
          },
          { startDate: new Date() }
        );
      } else if (i > index) {
        await this.projectOtherStatusRepository.update(
          { project: { id: id }, name: statusItem.name },
          { startDate: null, endDate: null, status: false }
        );
      } else {
        await this.projectOtherStatusRepository.update(
          {
            project: { id: id },
            name: statusItem.name,
            startDate: IsNull(),
          },
          { startDate: new Date(), status: false }
        );

        await this.projectOtherStatusRepository.update(
          {
            project: { id: id },
            name: statusItem.name,
            endDate: IsNull(),
          },
          { endDate: new Date(), status: true }
        );
      }
      i++;
    }

    await this.projectOtherStatusRepository.update(
      { project: { id: id }, name: statu.name },
      { startDate: new Date(), endDate: null, status: false }
    );
  }
  async delete(id) {
    await this.projectOtherStatusRepository.delete({ project: id });
  }
}
