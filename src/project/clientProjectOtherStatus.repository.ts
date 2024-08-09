import { Repository } from "typeorm";
import {
  ClientOtherStatus,
  OtherStatus,
  ProjectStatus,
} from "../entities/index";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull } from "typeorm";

export class ClientOtherStatusRepository {
  constructor(
    @InjectRepository(ClientOtherStatus)
    private readonly clientOtherStatusRepository: Repository<ClientOtherStatus>
  ) {}
  // async checkExistingStatus() {
  //   const status = ["Backlog", "In Progress", "Review", "Completed", "Decling"];
  //   return status;
  // }
  async _createProjectStatus(projectData, selectedStatus) {
    const status = [
      { name: "Backlog", selected: false },
      { name: "In Progress", selected: false },
      { name: "Review", selected: false },
      { name: "Declined", selected: false },
      { name: "Completed", selected: false },
    ];

    const index = status.findIndex((item) => item.name === selectedStatus);

    let projectStatuse = [];
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
      projectStatuse.push(projectStatus);
    }
    if (selectedStatus == "Completed" || selectedStatus == "Approved") {
      projectStatuse[4].endDate = new Date();
      projectStatuse[4].status = true;
    }
    await this.clientOtherStatusRepository.save(projectStatuse);
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
        await this.clientOtherStatusRepository.update(
          { project: { id: statu.id }, name: status[i - 1].name },
          { endDate: new Date(), status: true }
        );
        await this.clientOtherStatusRepository.update(
          {
            project: { id: statu.id },
            name: status[i - 1].name,
            startDate: IsNull(),
          },
          { startDate: new Date() }
        );
      } else if (i > index) {
        await this.clientOtherStatusRepository.update(
          { project: { id: statu.id }, name: statusItem.name },
          { startDate: null, endDate: null, status: false }
        );
      } else {
        await this.clientOtherStatusRepository.update(
          {
            project: { id: statu.id },
            name: statusItem.name,
            startDate: IsNull(),
          },
          { startDate: new Date(), status: false }
        );

        await this.clientOtherStatusRepository.update(
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

    await this.clientOtherStatusRepository.update(
      { project: { id: statu.id }, name: statu.name },
      { startDate: new Date(), endDate: null, status: false }
    );
    if (statu.name == "Completed" || statu.name == "Approved")
      await this.clientOtherStatusRepository.update(
        { project: { id: statu.id }, name: "Completed" },
        { endDate: new Date(), status: true }
      );
  }
  //mutiple
  async updateProjectStatusMultiple(statu, id) {
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
        await this.clientOtherStatusRepository.update(
          { project: { id: id }, name: status[i - 1].name },
          { endDate: new Date(), status: true }
        );
        await this.clientOtherStatusRepository.update(
          {
            project: { id: id },
            name: status[i - 1].name,
            startDate: IsNull(),
          },
          { startDate: new Date() }
        );
      } else if (i > index) {
        await this.clientOtherStatusRepository.update(
          { project: { id: id }, name: statusItem.name },
          { startDate: null, endDate: null, status: false }
        );
      } else {
        await this.clientOtherStatusRepository.update(
          {
            project: { id: id },
            name: statusItem.name,
            startDate: IsNull(),
          },
          { startDate: new Date(), status: false }
        );

        await this.clientOtherStatusRepository.update(
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

    await this.clientOtherStatusRepository.update(
      { project: { id: id }, name: statu.name },
      { startDate: new Date(), endDate: null, status: false }
    );
    if (statu.name == "Completed" || statu.name == "Approved")
      await this.clientOtherStatusRepository.update(
        { project: { id: id }, name: "Completed" },
        { endDate: new Date(), status: true }
      );
  }
  async delete(id) {
    await this.clientOtherStatusRepository.delete({ project: id });
  }
}
