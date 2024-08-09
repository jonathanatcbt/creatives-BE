import { Repository } from "typeorm";
import { EditingStatus, ProjectStatus } from "../entities/index";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull } from "typeorm";

export class ProjectEditingStatusRepository {
  constructor(
    @InjectRepository(EditingStatus)
    private readonly projectEditingStatusRepository: Repository<EditingStatus>
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
    // const status = [
    //   { name: "In Queue", selected: false },
    //   { name: "Initial Review", selected: false },
    //   { name: "Editing", selected: false },
    //   { name: "Final Review", selected: false },
    //   { name: "Revise", selected: false },
    //   { name: "Approved", selected: false },
    // ];

    const status = [
      { name: "Brief", selected: false },
      { name: "Talent", selected: false },
      { name: "Editing", selected: false },
      { name: "Reviews", selected: false },
      { name: "Filming", selected: false },
      { name: "Editing", selected: false },
      { name: "Initial Review", selected: false },
      { name: "Final Review", selected: false },
      { name: "Approved", selected: false },
      { name: "Declined", selected: false },
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

    await this.projectEditingStatusRepository.save(projectStatuses);
  }
  async updateProjectStatus(statu) {
    let i = 0;
    const status = [
      { name: "In Queue", selected: false },
      { name: "Brief", selected: false },
      { name: "Talent", selected: false },
      { name: "Editing", selected: false },
      { name: "Reviews", selected: false },
      { name: "Filming", selected: false },
      { name: "Editing", selected: false },
      { name: "Initial Review", selected: false },
      { name: "Final Review", selected: false },
      { name: "Completed", selected: false },
      { name: "Declined", selected: false },
    ];
    const index = status.findIndex((item) => item.name === statu.name);

    for (const statusItem of status) {
      const projectStatus = new ProjectStatus();
      if (i === index && index != 0) {
        await this.projectEditingStatusRepository.update(
          { project: { id: statu.id }, name: status[i - 1].name },
          { endDate: new Date(), status: true }
        );
        await this.projectEditingStatusRepository.update(
          {
            project: { id: statu.id },
            name: status[i - 1].name,
            startDate: IsNull(),
          },
          { startDate: new Date() }
        );
      } else if (i > index) {
        await this.projectEditingStatusRepository.update(
          { project: { id: statu.id }, name: statusItem.name },
          { startDate: null, endDate: null, status: false }
        );
      } else {
        await this.projectEditingStatusRepository.update(
          {
            project: { id: statu.id },
            name: statusItem.name,
            startDate: IsNull(),
          },
          { startDate: new Date(), status: false }
        );
        await this.projectEditingStatusRepository.update(
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

    await this.projectEditingStatusRepository.update(
      { project: { id: statu.id }, name: statu.name },
      { startDate: new Date(), endDate: null, status: false }
    );
  }
  //mutiple

  async updateProjectStatusMultiple(statu, id) {
    let i = 0;
    const status = [
      { name: "In Queue", selected: false },
      { name: "Brief", selected: false },
      { name: "Talent", selected: false },
      { name: "Editing", selected: false },
      { name: "Reviews", selected: false },
      { name: "Filming", selected: false },
      { name: "Editing", selected: false },
      { name: "Initial Review", selected: false },
      { name: "Final Review", selected: false },
      { name: "Completed", selected: false },
      { name: "Declined", selected: false },
    ];
    const index = status.findIndex((item) => item.name === statu.name);

    for (const statusItem of status) {
      const projectStatus = new ProjectStatus();
      if (i === index && index != 0) {
        await this.projectEditingStatusRepository.update(
          { project: { id: id }, name: status[i - 1].name },
          { endDate: new Date(), status: true }
        );
        await this.projectEditingStatusRepository.update(
          {
            project: { id: id },
            name: status[i - 1].name,
            startDate: IsNull(),
          },
          { startDate: new Date() }
        );
      } else if (i > index) {
        await this.projectEditingStatusRepository.update(
          { project: { id: id }, name: statusItem.name },
          { startDate: null, endDate: null, status: false }
        );
      } else {
        await this.projectEditingStatusRepository.update(
          {
            project: { id: id },
            name: statusItem.name,
            startDate: IsNull(),
          },
          { startDate: new Date(), status: false }
        );
        await this.projectEditingStatusRepository.update(
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

    await this.projectEditingStatusRepository.update(
      { project: { id: id }, name: statu.name },
      { startDate: new Date(), endDate: null, status: false }
    );
  }
  async delete(id) {
    await this.projectEditingStatusRepository.delete({ project: id });
  }
  // async _projctSatusDelete(id) {
  //   await this.projectStatusRepository.delete({ project: { id } });
  // }
  // async _updateProjectStatus(projectStatus): Promise<any> {
  //   for (const status of projectStatus) {
  //     await this.projectStatusRepository.update(status.id, status);
  //   }
  //   return true;
}
