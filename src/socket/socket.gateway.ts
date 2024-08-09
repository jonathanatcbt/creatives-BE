// socket.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets";
import { MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { config } from "dotenv";
import { ProjectService } from "src/project/project.service";
config();

@WebSocketGateway(9001)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connectedClients: Map<Socket, string> = new Map();
  constructor(private readonly projectService: ProjectService) {}
  async fetchAndBroadcastData(client: Socket) {
    const projects = await this.projectService.findAllProject();
    const maxId = await this.projectService.projectMaxId();
    const orderList = await this.projectService.projectOrderData();
    client.broadcast.emit("project-add", {
      project: projects,
      maxId: maxId,
      projectOrder: orderList,
    });
  }

  async fetchAndBroadcastDataWithId(client: Socket, projectId) {
    const projects = await this.projectService.findProject(projectId);
    // const maxId = await this.projectService.projectMaxId();
    const orderList = await this.projectService.projectOrderData();
    console.log(
      client.broadcast.emit("update-project", {
        project: projects,
        // maxId: maxId,
        projectOrder: orderList,
      })
    );
  }

  async deletPeoject(client: Socket, data) {
    // const maxId = await this.projectService.projectMaxId();
    const orderList = await this.projectService.projectOrderData();
    console.log(orderList);
    console.log("data", data);
    console.log(
      client.broadcast.emit("delete-project", {
        data: data,
        // maxId: maxId,
        projectOrder: orderList,
      })
    );
  }

  async orderList(client: Socket) {
    // const maxId = await this.projectService.projectMaxId();
    const orderList = await this.projectService.projectOrderData();
    client.broadcast.emit("list-order", {
      projectOrder: orderList,
    });
  }

  async fetchCompany(client: Socket, email) {
    let company = null;
    const user = await this.projectService.getCompany(email);
    console.log(user);
    if (user && user.company) company = user.company.id;

    this.server.emit("company-id", {
      email: email,
      company: company,
    });
  }
  handleConnection(client: Socket) {
    console.log(`socket connected on port ${process.env.SOCKET_PORT}`);
    client.on("project-list", (data) => {
      console.log(data);
      this.fetchAndBroadcastData(client);
    });
    client.on("project-delete", (data) => {
      console.log(data);
      this.deletPeoject(client, data);
    });

    client.on("order-list", (data) => {
      console.log("order-list", data);
      this.orderList(client);
    });
    client.on("project-update", (data) => {
      console.log("update", data);
      this.fetchAndBroadcastDataWithId(client, data.id);
    });

    client.on("company-change", (data) => {
      console.log("data", data);
      this.fetchCompany(client, data.email);
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client);
    console.log("disconnected");
  }
  // @SubscribeMessage("company-delete")
  // handleMessage() {
  //   // this.server.emit("project-add", {
  //   //   project: project,
  //   //   maxId: maxId,
  //   //   projectOrder: projectOrder,
  //   // });
  // }

  async companyDelete(user) {
    this.server.emit("company-delete", {
      user,
    });
  }
  async companyData(company) {
    console.log(
      this.server.emit("company-data", {
        company,
      })
    );
  }
  async userData(user, isClient?) {
    this.server.emit("user-data", {
      user,
      isClient: isClient,
    });
  }
  async notifactionList(editor) {
    console.log("editor-list", editor);
    this.server.emit("notifaction-list", {
      editor,
    });
  }
}
