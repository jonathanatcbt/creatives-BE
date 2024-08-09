import { Module, forwardRef } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { UserModule } from "src/user/user.module";
import { ProjectModule } from "src/project/project.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectStatusLog } from "src/entities";
import { SocketModule } from "src/socket/socket.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => SocketModule),
    forwardRef(() => ProjectModule),
    TypeOrmModule.forFeature([ProjectStatusLog]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
