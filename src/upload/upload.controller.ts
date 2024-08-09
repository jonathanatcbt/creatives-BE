import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Delete,
  UseGuards,
  Request,
  Param,
  Body,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { CompanyService } from "src/company/company.service";
import { SocketService } from "src/socket/socket.service";
import { SocketGateway } from "src/socket/socket.gateway";
@Controller()
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly companyService: CompanyService,
    private readonly socketGateway: SocketGateway
  ) {}

  @Post("upload/image")
  @UseInterceptors(FileInterceptor("image"))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ): Promise<string> {
    return await this.uploadService.uploadImage(file, req);
  }
  @Delete("company/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onDelete(@Request() req: any, @Param("id") id: number): Promise<any> {
    try {
      const user = await this.companyService.findUserCompany(id);
      const company = await this.companyService.deleteCompany(
        id,
        req.user.userId
      );
      await this.socketGateway.companyDelete(user);
      await this.socketGateway.companyData(await this.companyService.findAll());
      console.log(user);
      return company;
    } catch (err) {
      console.log("err2", err);
    }
  }
  @Post("company")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onCreate(
    @Res() res: Response,
    @Request() req: any,
    @Body() company: any
  ) {
    await this.companyService._crete(company.companyName, req.user.userId, res);
    await this.socketGateway.companyData(await this.companyService.findAll());
  }
}
