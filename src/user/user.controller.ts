import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
  Get,
  Patch,
  Query,
  Res,
} from "@nestjs/common";
import { CreateUserResponse, EmailAlradyRegistered } from "./interface/index";
import { ApiTags, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto, AddUserDto, UserDeatilsUpdateDto } from "./../dto";
import { AuthGuard } from "@nestjs/passport";
import { EmailService } from "./../helper/email.service";
import { SetPasswordDtos } from "./../dto";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("User")
@Controller("")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}
  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Register Successfully",
        data: {
          id: "number",
          name: "string",
          email: "string",
        },
      },
    },
    description: "It will return user data with success message",
  })
  @ApiBadRequestResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: ["string", "string"],
        error: "Bad Request",
      },
    },
    description: "It will return Bad Request Error",
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
  @Post("user")
  @ApiBody({ type: CreateUserDto })
  async onCreateUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<CreateUserResponse | EmailAlradyRegistered | any> {
    return await this.userService.createUser(createUserDto);
  }
  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Register Successfully",
        data: {
          id: "number",
          name: "string",
          email: "string",
          role: "string",
          isActive: "boolean",
        },
      },
    },
    description: "It will return user data with success message",
  })
  @ApiBadRequestResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: ["string", "string"],
        error: "Bad Request",
      },
    },
    description: "It will return Bad Request Error",
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
  @ApiUnauthorizedResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: "Unauthorized",
      },
    },
    description: "It will return unauthorized error",
  })
  @Post("addUser")
  @ApiBody({ type: AddUserDto })
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onAddUser(
    @Body() addUserDto: AddUserDto,
    @Request() req: any,
    @Query("isClient") isClient?: boolean
  ): Promise<EmailAlradyRegistered | any> {
    if (req.user.role != "admin") {
      return {
        status: false,
        message: "Sorry this feature allow just admin",
      };
    }
    return await this.userService.addUser(
      addUserDto,
      req.user.userId,
      isClient
    );
  }
  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Password set successfully",
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
        message: ["string", "string"],
        error: "Bad Request",
      },
    },
    description: "It will return Bad Request Error",
  })
  @Put("user/setPassword")
  async onSetPassword(@Body() setPasswordDto: SetPasswordDtos): Promise<any> {
    return await this.userService.setPassword(setPasswordDto);
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
  @Get("getAdminProject/:adminId")
  async OnFindClientProject(@Param("adminId") adminId: number) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: {},
    };
    const adminProject = await this.userService._findProject(
      "id",
      adminId,
      "adminProjects"
    );
    if (adminProject) {
      response.status = true;
      response.message = "Data found";
      response.data = adminProject;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }
  // @Post("blockUser/:id")
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  // async onBlockUser(
  //   @Request() req: any,
  //   @Param("id") id: number,
  //   @Body() bodyData: any
  // ): Promise<any> {
  //   // if (req.user.role != "admin") {
  //   //   return {
  //   //     status: false,
  //   //     message: "Sorry this feature allow just admin",
  //   //   };
  //   // }
  //   return await this.userService.updateUser(id, bodyData, req.user.userId);
  // }
  @Put("mark-editor")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onMarkditor(@Request() req: any): Promise<any> {
    if (req.user.role != "admin") {
      return {
        status: false,
        message: "Sorry this feature allow just admin",
      };
    }
    return await this.userService.markEditor(req.user.userId);
  }

  // @Patch("updateUser/:id")
  // @ApiBody({ type: UserDeatilsUpdateDto })
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  // async onupdateUserDeatails(
  //   @Res() res: Response,
  //   @Request() req: any,
  //   @Body() userDeatilsUpdateDto: UserDeatilsUpdateDto,
  //   @Param("id") id: number
  // ): Promise<any> {
  //   return await this.userService.updateUserData(
  //     userDeatilsUpdateDto,
  //     id,
  //     req.user.userId,
  //     res
  //   );
  // }

  @Get("user/:id")
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  async onGetSingleUserDeatails(@Param("id") id: number): Promise<any> {
    return await this.userService.getSingleUserData(id);
  }
  // @Put("user/role-change/:id")
  // async onRoleChnahe(
  //   @Body() roleChnge: any,
  //   @Param("id") id: number
  // ): Promise<any> {
  //   return await this.userService.roleChange(roleChnge, id);
  // }
}
