import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Project, User, ProjectStatusLog } from "./../entities/index";
import {
  CreateUserDto,
  AddUserDto,
  SetPasswordDtos,
  UserDeatilsUpdateDto,
} from "./../dto";
import { CreateUserResponse } from "./interface/index";
import { EmailService } from "./../helper/email.service";
import * as bcrypt from "bcrypt";
import { config } from "dotenv";

config();

import { EmailAlradyRegistered } from "./interface/index";
import { ProjectService } from "src/project/project.service";
import { CompanyService } from "src/company/company.service";
import { EditorProejctRepository } from "src/project/editorProject.repository";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService, // private readonly projectService: ProjectService
    private readonly companyService: CompanyService,
    private readonly EditorProejctRepository: EditorProejctRepository,
    private readonly jwtService: JwtService,
    @InjectRepository(ProjectStatusLog)
    private readonly projectStatusLogRepository: Repository<ProjectStatusLog>
  ) {}
  async getHello() {
    await this.userRepository.find();
  }
  async createUser(
    createUserDto: CreateUserDto
  ): Promise<CreateUserResponse | EmailAlradyRegistered | any> {
    if (await this._findUser("email", createUserDto.email)) {
      return {
        status: false,
        message: "The provided email is already registered.",
      };
    }
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.isActive = true;
      createUserDto.role = "client";
      createUserDto.isAccepted = true;
      const newUser = this.userRepository.create(createUserDto);
      const user = await this.userRepository.save(newUser);
      return {
        status: true,
        message: "Register Successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (err) {
      return {
        status: false,
        message: "Internal Server Error",
        error: "Bad Request",
      };
    }
  }

  async addUser(
    addUserDto: AddUserDto,
    adminId,
    isClient
  ): Promise<EmailAlradyRegistered | any> {
    const findedUser = await this._findUsers("email", addUserDto.email);

    if (findedUser && findedUser.isAccepted) {
      return {
        status: false,
        message: "The provided email is already registered.",
      };
    }

    try {
      let user;

      if (!findedUser) {
        let role = "editor";

        const adminUser = await this._findUser("id", adminId);

        const userData = this.userRepository.create({
          email: addUserDto.email,
          name: addUserDto.name,
          admin: adminUser,
          isActive: false,
          role: role,
        });
        if (isClient && isClient == "true") {
          userData.role = "client";
          if (addUserDto.companyId) {
            userData.company = await this.companyService.findOne(
              addUserDto.companyId
            );
          } else if (addUserDto.companyName) {
            userData.company = await this.companyService.crete(
              addUserDto.companyName
            );
          }
        }
        console.log(userData);
        user = await this.userRepository.save(userData);
        console.log(user);
      } else user = findedUser;
      const token = await this.generateAccessToken(user);
      const resetLink = `${process.env.FROETEND_URL}/user-signup/${token}`;
      const subject = "User Signup";
      const html = `
        <p>Click on the link below to set your password:</p>
        <p><a href="${resetLink}" style="text-decoration: underline;">${process.env.FROETEND_URL}/user-signup/${token}</a></p>
      `;

      await this.emailService.sendEmail(addUserDto.email, subject, html);
      return {
        status: true,
        message: "Invite Send  Successfully",
      };
    } catch (err) {
      return {
        status: false,
        message: "Internal Server Error",
        error: "Bad Request",
      };
    }
  }
  async _findUser(name: string, value: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { [name]: value, isActive: true },
    });
  }

  async _findUsers(name: string, value: string): Promise<User> {
    // return await this.userRepository.findOne({
    //   where: { [name]: value },
    // });
    // const userRepository = getRepository(User);

    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.company", "company")
      .where(`user.${name} = :value`, { value })
      .getOne();

    return user;
  }

  async _findAllUserwithAdmin(name: string, value: string): Promise<any> {
    return await this.userRepository.find({
      where: [{ [name]: value }, { is_editor: true }],
      select: [
        "id",
        "name",
        "email",
        "isActive",
        "createdAt",
        "updatedAt",
        "role",
        "is_editor",
        "is_super_admin",
      ],
    });
  }
  async _findAllUser(name: string, value: string): Promise<any> {
    return await this.userRepository

      .createQueryBuilder("user")

      .leftJoinAndSelect("user.company", "company") // Join with the Company entity
      .where(`user.${name} = :value`, { value })
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.isActive",
        "user.createdAt",
        "user.updatedAt",
        "user.role",
        "user.isAccepted",
        "user.is_super_admin",
        "company.id", // Include company id
        "company.name", // Include company name
      ])
      .orderBy("user.id", "ASC")
      .getMany();
  }

  async _findUserWithId(name: string, value: string, id): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: Not(id), [name]: value },
    });
  }

  async _validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    // Compare the provided password with the hashed password
    return await bcrypt.compare(password, hashedPassword);
  }
  async setPassword(setPasswordDto: SetPasswordDtos): Promise<any> {
    try {
      let jwtPayload = await decode(setPasswordDto.id);

      jwtPayload = { jwtPayload };
      const id = jwtPayload.jwtPayload.userId;

      if (!(await this.userRepository.findOne({ where: { id: id } })))
        return {
          status: false,
          message: "User not found",
        };
      setPasswordDto.password = await bcrypt.hash(setPasswordDto.password, 10);
      await this.userRepository.update(id, {
        password: setPasswordDto.password,
        name: setPasswordDto.name,
        image: setPasswordDto.image,
        isActive: true,
        isAccepted: true,
      });
      return { status: true, message: "Password set successfully" };
    } catch (err) {
      throw err;
    }
  }
  async deleteUser(id: number): Promise<any> {
    await this.userRepository.delete(id);
  }
  public async _deleteUsers(id): Promise<any> {
    try {
      await this.userRepository.delete({
        admin: id,
      });

      return await this.userRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }

  public async _updateUsers(id, updateDto): Promise<any> {
    if (await this._findUserWithId("email", updateDto.email, id)) return false;
    updateDto.password = await bcrypt.hash(updateDto.password, 10);
    return await this.userRepository.update(id, updateDto);
  }

  async _findProject(name: string, value: number, realtion): Promise<User> {
    return await this.userRepository.findOne({
      where: { [name]: value },
      relations: [realtion],
    });
  }

  async updateUser(id, bodyData, userId, res): Promise<any> {
    if (bodyData.isActive) bodyData.isActive = false;
    else bodyData.isActive = true;
    // const user = await this.userRepository.findOne({ id: 1 });
    const user = await this.userRepository.findOneOrFail({ where: { id: id } });

    // if (user) {
    //   if (user.role == "editor") {
    //     await this.projectRepository.update(
    //       { editorId: id },
    //       { userActiveProject: bodyData.isActive }
    //     );
    //   } else if (user.role == "client") {
    //     await this.projectRepository.update(
    //       { clientId: id },
    //       { userActiveProject: bodyData.isActive }
    //     );
    //   }
    // }
    await this.saveLog(
      user.id,
      userId,
      "user-active",
      user.isActive,
      bodyData.isActive
    );
    await this.userRepository.update(id, {
      isActive: bodyData.isActive,
    });
    res.json({ status: true, message: "User isActive update Successfully" });
  }

  async findEditor(adminId): Promise<any> {
    return await this.userRepository.find({
      where: [{ role: "editor" }, { role: "admin" }],
      select: [
        "id",
        "name",
        "email",
        "image",
        "isActive",
        "createdAt",
        "updatedAt",
        "role",
        "is_editor",
        "isAccepted",
        "is_super_admin",
      ],
      order: {
        id: "ASC", // Sort by id in ascending order
      },
    });
  }

  async findEditors(adminId): Promise<any> {
    return await this.userRepository.find({
      where: [
        { admin: { id: adminId }, role: "editor", isAccepted: false },
        { is_editor: true, isAccepted: false },
      ],

      select: [
        "id",
        "name",
        "email",
        "image",
        "isActive",
        "createdAt",
        "updatedAt",
        "role",
        "is_super_admin",
      ],
    });
  }
  async addToken(tokenData, id): Promise<any> {
    await this.userRepository.update({ id: id }, tokenData);
  }
  async markEditor(id): Promise<any> {
    await this.userRepository.update(id, {
      is_editor: true,
    });
    return { status: true, message: "Admin update Successfully" };
  }
  async _findEdiotNoti(name: string, value: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { [name]: value },
      relations: ["editorNotifications"],
    });
  }
  async _setPassword(password, id): Promise<any> {
    password = await bcrypt.hash(password, 10);
    await this.userRepository.update({ id: id }, { password });
  }
  async _setPasswords(password, id): Promise<any> {
    let jwtPayload = await decode(id);
    jwtPayload = { jwtPayload };
    id = jwtPayload.jwtPayload.userId;

    password = await bcrypt.hash(password, 10);

    if (!(await this.userRepository.findOne({ where: { id: id } })))
      return {
        status: false,
        message: "User not found",
      };

    await this.userRepository.update({ id: id }, { password: password });

    return {
      status: true,
      message: "Password Set Successfully",
    };
  }

  async updateUserData(
    user: UserDeatilsUpdateDto,
    id,
    userId,
    res
  ): Promise<any> {
    if (user.email && (await this._findUserWithId("email", user.email, id))) {
      return {
        status: false,
        message: "The provided email is already exist.",
      };
    }
    let company = null;
    if (user.companyId) {
      company = await this.companyService.findOne(user.companyId);
    }

    const updatedUser = await this.userRepository.update(
      { id: id },
      {
        company: company,
        name: user.name,
        image: user.image,
        email: user.email,
        role: user.role,
      }
    );
    await this.saveLog(id, userId, "update-user-data");
    res.json({
      status: true,
      message: "Update Successfully",
      data: user,
    });
  }

  async changePassword(newPassword, id): Promise<any> {
    newPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, {
      password: newPassword,
    });
    return { status: true, message: "Password Change successfully" };
  }
  async getSingleUserData(id): Promise<any> {
    try {
      const user = await this.userRepository
        .createQueryBuilder("user")
        .select([
          "user.id",
          "user.name",
          "user.email",
          "user.isActive",
          "user.image",
          "user.role",
          "user.is_editor",
          "user.isAccepted",
          "user.is_super_admin",
        ]) // Include all columns you need except fcm_token, password, createdAt, updatedAt
        .where({ id: id })
        .getOne();
      if (user) {
        return {
          status: true,
          message: "Data found",
          data: user,
        };
      } else
        return {
          status: false,
          message: "Data Not found",
        };
    } catch (err) {
      throw err;
    }
  }

  async roleChange(roleChange, id, res): Promise<any> {
    let role;
    let is_editor = false;

    if (roleChange.roleId == 1) role = "editor";
    else if (roleChange.roleId == 2) {
      await this.EditorProejctRepository._delteUserProejct(id);
      role = "admin";
    }
    if (roleChange.roleId == 3) {
      role = "admin";
      is_editor = true;
    }

    try {
      const user = await this.userRepository.update(
        { id: id },
        { role: role, is_editor: is_editor }
      );

      res.json({
        status: true,
        message: "Role Change",
      });
    } catch (err) {
      throw err;
    }
  }
  private async generateAccessToken(user: User): Promise<any> {
    const payload = { userId: user.id, role: user.role };
    const expiresIn = "14d"; // Token expires after 5 hours

    return this.jwtService.sign(payload, { expiresIn });
  }
  async saveLog(projectId, userId, module, currentStage?, previousStage?) {
    const project = new ProjectStatusLog();
    project.projectId = projectId;
    project.userId = userId;
    project.module = module;
    project.currentStage = currentStage;
    project.previousStage = previousStage;
    await this.projectStatusLogRepository.save(project);
  }
}
