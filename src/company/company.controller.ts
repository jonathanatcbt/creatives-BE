import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { Company } from "src/entities";
@ApiTags("company")
@Controller("")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @ApiNotFoundResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: "Dat Not Found",
      },
    },
    description: "It will through when data not found",
  })
  @ApiResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "data found",
        data: [],
      },
    },
    description: "It will return data",
  })
  @ApiBadRequestResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: "Bad Request",
      },
    },
    description: "It will return Bad Request Error",
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: "object",
      example: {
        statusCode: 500,
        message: "string",
      },
    },
    description: "It will return internal server error",
  })
  @ApiNotFoundResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: "Dat Not Found",
      },
    },
    description: "It will through when data not found",
  })
  @Get("company")
  async onFindAll() {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
      maxId: Number,
    };
    const company = await this.companyService.findAll();

    if (company.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = company;
      response.maxId = await this.companyService.maxId();
    } else {
      response.status = true;
      response.message = "Data not found";
      response.maxId = await this.companyService.maxId();
    }
    return response;
  }

  // @Post("company")
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  // async onCreate(@Request() req: any, @Body() company: any) {
  //   return await this.companyService._crete(
  //     company.companyName,
  //     req.user.userId
  //   );
  // }

  // @Delete("company/:id")
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  // async onDelete(@Request() req: any, @Param("id") id: number): Promise<any> {
  //   try {
  //     return await this.companyService.deleteCompany(id, req.user.userId);
  //   } catch (err) {
  //     console.log("err2", err);
  //   }
  // }
}
