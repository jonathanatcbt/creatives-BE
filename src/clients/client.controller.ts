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
  Res,
  Patch,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ClientService } from "./client.service";
import { UpdateClientDto, UserDeatilsUpdateDto } from "./../dto";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
@ApiTags("Client")
@Controller("")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
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
  @Get("client")
  async onFindAll() {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const client = await this.clientService.findAll();
    if (client.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = client;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }

  @ApiResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "data found",
        data: {},
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
  @Get("client/:id")
  async OnFindOne(@Param("id") id: number) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: {},
    };
    const client = await this.clientService.findOne(id);
    if (client) {
      response.status = true;
      response.message = "Data found";
      response.data = client;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }

  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Client Update successfully",
      },
    },
    description: "It will return with success message",
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: "object",
      example: {
        status: false,
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
        message: "email already exist",
      },
    },
    description: "It will through already exist message",
  })
  @Put("client/:id")
  @ApiBody({ type: UpdateClientDto })
  async onUpdate(
    @Param("id") id: number,
    @Body() updateClientDto: UpdateClientDto
  ) {
    return await this.clientService._update(id, updateClientDto);
  }
  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Client Delete successfully",
      },
    },
    description: "It will return with success message",
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: "string",
      },
    },
    description: "It will return internal server error",
  })
  @ApiBadRequestResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: "Client not found",
      },
    },
    description: "It will return Client not found",
  })
  @Delete("client/:id")
  async oRemove(@Param("id") id: number) {
    return await this.clientService.remove(id);
  }

  @ApiResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "data found",
        data: {},
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
  @Get("getClientProject/:clientId")
  async OnFindClientProject(@Param("clientId") clientId: number) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const clientProject = await this.clientService.findClientProject(clientId);
    if (clientProject.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = clientProject;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }

  @Delete("user/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onDeleteUser(
    @Res() res: Response,
    @Request() req: any,
    @Param("id") id: number
  ): Promise<any> {
    try {
      return await this.clientService._deleteUser(id, req.user.userId, res);
    } catch (err) {
      console.log("err2", err);
    }
  }
  @Patch("updateUser/:id")
  @ApiBody({ type: UserDeatilsUpdateDto })
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onupdateUserDeatails(
    @Res() res: Response,
    @Request() req: any,
    @Body() userDeatilsUpdateDto: UserDeatilsUpdateDto,
    @Param("id") id: number
  ): Promise<any> {
    return await this.clientService.updateUserData(
      userDeatilsUpdateDto,
      id,
      req.user.userId,
      res
    );
  }
  @Put("user/role-change/:id")
  async onRoleChnahe(
    @Res() res: Response,
    @Body() roleChnge: any,
    @Param("id") id: number
  ): Promise<any> {
    return await this.clientService.roleChange(roleChnge, id, res);
  }
  @Post("blockUser/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onBlockUser(
    @Res() res: Response,
    @Request() req: any,
    @Param("id") id: number,
    @Body() bodyData: any
  ): Promise<any> {
    // if (req.user.role != "admin") {
    //   return {
    //     status: false,
    //     message: "Sorry this feature allow just admin",
    //   };
    // }
    return await this.clientService.updateUser(
      id,
      bodyData,
      req.user.userId,
      res
    );
  }
}
