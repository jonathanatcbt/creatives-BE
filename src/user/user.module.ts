import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./../entities/user.entity";
import { EmailService } from "./../helper/email.service";
import { ProjectEditor, ProjectStatusLog } from "src/entities";
import { CompanyModule } from "src/company/company.module";
import { EditorProejctRepository } from "src/project/editorProject.repository";
import { JwtModule } from "@nestjs/jwt";

import { ClientModule } from "src/clients/client.module";

@Module({
  imports: [
    forwardRef(() => CompanyModule),
    TypeOrmModule.forFeature([User, ProjectEditor, ProjectStatusLog]),

    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, EmailService, EditorProejctRepository],
  exports: [UserService],
})
export class UserModule {}
