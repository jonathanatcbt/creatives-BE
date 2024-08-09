import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { Company, Project, ProjectStatusLog, User } from "src/entities";
import { Repository, IsNull, Not } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { error } from "console";
import { SocketGateway } from "src/socket/socket.gateway";
import { SocketService } from "src/socket/socket.service";
import { AuthService } from "src/auth/auth.service";
import { UploadService } from "src/upload/upload.service";
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProjectStatusLog)
    private readonly projectStatusLogRepository: Repository<ProjectStatusLog>
  ) {}
  async findAll(): Promise<any> {
    return await this.companyRepository.find({
      where: {
        deletedAt: IsNull(), // This condition filters out soft-deleted records
      },
    });
  }
  async findOne(id): Promise<any> {
    try {
      return await this.companyRepository.findOne({
        where: {
          id: id, // This condition filters out soft-deleted records
        },
      });
    } catch (err) {
      throw err;
    }
  }
  async maxId(): Promise<any> {
    try {
      const maxIdObject = await this.companyRepository.findOne({
        where: { id: Not(IsNull()) },
        withDeleted: true, // A condition that always evaluates to true
        order: {
          id: "DESC", // Replace 'id' with the column you want to use for sorting
        },
      });
      if (maxIdObject) return maxIdObject.id;
      else return 0;
    } catch (error) {
      console.error("Error fetching maximum ID:", error);
    }
  }

  async crete(companyName): Promise<any> {
    return await this.companyRepository.save({ name: companyName });
  }

  async _crete(companyName, userId, res): Promise<any> {
    try {
      const company = await this.companyRepository.save({ name: companyName });
      await this.saveLog(company.id, userId, "company-create");
      res.json({
        status: true,
        message: "Create Comapny Successfully",
        data: company,
      });
    } catch (error) {
      throw error;
    }
  }
  async delete(id): Promise<any> {
    try {
      return await this.companyRepository.delete({ users: { id: id } });
    } catch (err) {
      throw err;
    }
  }
  async findUserCompany(id): Promise<any> {
    const emailArray = await this.userRepository
      .createQueryBuilder("user")
      .select("user.email")
      .where("user.company = :id", { id: id })
      .getRawMany();
    console.log(emailArray);
    return emailArray;
  }
  async deleteCompany(id, userId): Promise<any> {
    try {
      // Delete the company (associated projects won't be deleted due to cascade: false)
      await this.projectRepository.update(
        { company: { id: id } },
        { company: null }
      );
      await this.userRepository.update(
        { company: { id: id } },
        { company: null }
      );

      // await this.companyRepository.delete(id);
      const company = await this.companyRepository.findOne({
        where: { id: id },
      });
      if (company) {
        company.userId = userId;
        await this.companyRepository.save(company);
        await this.companyRepository.softRemove(company);
      }
      await this.saveLog(company.id, userId, "company-delete");
      return {
        status: true,
        message: "success",
      };
    } catch (err) {
      throw err;
    }
  }
  async saveLog(projectId, userId, module) {
    const project = new ProjectStatusLog();
    project.projectId = projectId;
    project.userId = userId;
    project.module = module;
    await this.projectStatusLogRepository.save(project);
  }
}
