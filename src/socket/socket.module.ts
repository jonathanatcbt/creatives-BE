import { Module, forwardRef } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { SocketService } from "./socket.service";
import { ProjectModule } from "src/project/project.module";

@Module({
  imports: [forwardRef(() => ProjectModule)],
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway, SocketService],
})
export class SocketModule {}
