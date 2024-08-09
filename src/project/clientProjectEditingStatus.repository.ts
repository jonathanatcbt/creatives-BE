import { Any, Repository, Not } from "typeorm";
import {
  ClientEditingStatus,
  EditingStatus,
  ProjectStatus,
} from "../entities/index";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull } from "typeorm";

export class ClientProjectEditingStatusRepository {
  constructor(
    @InjectRepository(ClientEditingStatus)
    private readonly clientProjectEditingStatusRepository: Repository<ClientEditingStatus>
  ) {}
  async checkExistingStatus() {}
  //   const status = [
  //     "Brief",
  //     "B Roll",
  //     "Talent",
  //     "Editing",
  //     "Initial Review",
  //     "Final Review",
  //   ];
  //   return status;
  // }
  async _createProjectStatus(projectData, selectedStatus) {
    const clientStatus = [
      { name: "Project Start", selected: false },
      { name: "Brief", selected: false },
      { name: "Talent", selected: false },
      { name: "Editing", selected: false },
      { name: "Reviews", selected: false },
      { name: "Completed", selected: false },
    ];
    selectedStatus = await this.map(selectedStatus);

    const index = clientStatus.findIndex(
      (item) => item.name === selectedStatus
    );

    let projectStatuse = [];
    let i = 0;
    for (const statusItem of clientStatus) {
      const projectStatus = new ProjectStatus();
      projectStatus.name = statusItem.name;
      projectStatus.project = projectData;
      if (statusItem.name === clientStatus[index].name) {
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
      projectStatuse[5].endDate = new Date();
      projectStatuse[5].status = true;
    }
    const data = await this.clientProjectEditingStatusRepository.save(
      projectStatuse
    );
  }

  async updateProjectStatus(statu) {
    let i = 0;
    const status = [
      { name: "Project Start", selected: false },
      { name: "Brief", selected: false },
      { name: "Talent", selected: false },
      { name: "Editing", selected: false },
      { name: "Reviews", selected: false },
      { name: "Completed", selected: false },
    ];

    // const exsitStatus = await this.clientProjectEditingStatusRepository.findOne(
    //   {
    //     where: {
    //       project: {
    //         id: statu.id,
    //       },
    //       startDate: Not(IsNull()),
    //       endDate: IsNull(),
    //     },
    //   }
    // );

    const index = status.findIndex((item) => item.name === statu.name);
    for (const statusItem of status) {
      const projectStatus = new ProjectStatus();
      if (i === index && index != 0) {
        await this.clientProjectEditingStatusRepository.update(
          { project: { id: statu.id }, name: status[i - 1].name },
          { endDate: new Date(), status: true }
        );
        await this.clientProjectEditingStatusRepository.update(
          {
            project: { id: statu.id },
            name: status[i - 1].name,
            startDate: IsNull(),
          },
          { startDate: new Date() }
        );
      } else if (i > index) {
        await this.clientProjectEditingStatusRepository.update(
          { project: { id: statu.id }, name: statusItem.name },
          { startDate: null, endDate: null, status: false }
        );
      } else {
        await this.clientProjectEditingStatusRepository.update(
          {
            project: { id: statu.id },
            name: statusItem.name,
            startDate: IsNull(),
          },
          { startDate: new Date(), status: false }
        );

        await this.clientProjectEditingStatusRepository.update(
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
    // if (exsitStatus.name != statu.name) {
    //   console.log(index);
    //   console.log(exsitStatusindex);
    //   if (index > exsitStatusindex)
    //     await this.clientProjectEditingStatusRepository.update(
    //       { project: { id: statu.id }, name: exsitStatus.name },
    //       { endDate: new Date(), status: true }
    //     );
    // }

    if (index == 5) {
      await this.clientProjectEditingStatusRepository.update(
        { project: { id: statu.id }, name: "Reviews" },
        { endDate: new Date(), status: true, startDate: new Date() }
      );
    }

    await this.clientProjectEditingStatusRepository.update(
      { project: { id: statu.id }, name: statu.name },
      { startDate: new Date(), endDate: null, status: false }
    );
    if (statu.name == "Completed" || statu.name == "Approved")
      await this.clientProjectEditingStatusRepository.update(
        { project: { id: statu.id }, name: "Completed" },
        { endDate: new Date(), status: true }
      );
  }
  //mutiple
  async updateProjectStatusMultiple(statu, id) {
    let i = 0;
    const status = [
      { name: "Project Start", selected: false },
      { name: "Brief", selected: false },
      { name: "Talent", selected: false },
      { name: "Editing", selected: false },
      { name: "Reviews", selected: false },
      { name: "Completed", selected: false },
    ];

    // const exsitStatus = await this.clientProjectEditingStatusRepository.findOne(
    //   {
    //     where: {
    //       project: {
    //         id: id,
    //       },
    //       startDate: Not(IsNull()),
    //       endDate: IsNull(),
    //     },
    //   }
    // );

    const index = status.findIndex((item) => item.name === statu.name);
    for (const statusItem of status) {
      const projectStatus = new ProjectStatus();
      if (i === index && index != 0) {
        await this.clientProjectEditingStatusRepository.update(
          { project: { id: id }, name: status[i - 1].name },
          { endDate: new Date(), status: true }
        );
        await this.clientProjectEditingStatusRepository.update(
          {
            project: { id: id },
            name: status[i - 1].name,
            startDate: IsNull(),
          },
          { startDate: new Date() }
        );
      } else if (i > index) {
        await this.clientProjectEditingStatusRepository.update(
          { project: { id: id }, name: statusItem.name },
          { startDate: null, endDate: null, status: false }
        );
      } else {
        await this.clientProjectEditingStatusRepository.update(
          {
            project: { id: id },
            name: statusItem.name,
            startDate: IsNull(),
          },
          { startDate: new Date(), status: false }
        );

        await this.clientProjectEditingStatusRepository.update(
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
    // if (exsitStatus.name != statu.name) {
    //   console.log(index);
    //   console.log(exsitStatusindex);
    //   if (index > exsitStatusindex)
    //     await this.clientProjectEditingStatusRepository.update(
    //       { project: { id: id }, name: exsitStatus.name },
    //       { endDate: new Date(), status: true }
    //     );
    // }

    if (index == 5) {
      await this.clientProjectEditingStatusRepository.update(
        { project: { id: id }, name: "Reviews" },
        { endDate: new Date(), status: true, startDate: new Date() }
      );
    }

    await this.clientProjectEditingStatusRepository.update(
      { project: { id: id }, name: statu.name },
      { startDate: new Date(), endDate: null, status: false }
    );
    if (statu.name == "Completed" || statu.name == "Approved")
      await this.clientProjectEditingStatusRepository.update(
        { project: { id: id }, name: "Completed" },
        { endDate: new Date(), status: true }
      );
  }
  async delete(id) {
    await this.clientProjectEditingStatusRepository.delete({ project: id });
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
}
