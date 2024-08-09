import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { SocketGateway } from "./socket.gateway";

@Injectable()
export class SocketService {
  constructor(private readonly socketGateway: SocketGateway) {}

  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    console.log("here");
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on("disconnect", () => {
      this.connectedClients.delete(clientId);
    });

    // Handle other events and messages from the client
  }

  // Add more methods for handling events, messages, etc.
}
