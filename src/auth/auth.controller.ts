import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  ChangePasswordDto,
  LoginUserDto,
  RefreshTokenDto,
  SetPasswordDto,
} from "./../dto";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { AddUserDto } from "./../dto";
@ApiTags("Auth")
@Controller("")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Successfully Login",
        data: {
          id: "number",
          name: "string",
          email: "string",
          accessToken: "string",
        },
      },
    },
    description: "It will return  login with success message",
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
        message: "Invalid credentials",
      },
    },
    description: "It will through Invalid credentials  message",
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
  @ApiBody({ type: LoginUserDto })
  @Post("auth/login")
  async onLoginUser(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return await this.authService.userLogin(loginUserDto);
  }
  @ApiBody({ type: RefreshTokenDto })
  @Post("refresh-token")
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const refreshedAccessToken = await this.authService.refreshAccessToken(
      refreshToken
    );

    return { status: true, accessToken: refreshedAccessToken };
  }
  @ApiBody({ type: AddUserDto })
  @Post("auth/send-link")
  async onSendLink(@Body() body: AddUserDto) {
    return await this.authService.sendUrl(body.email);
  }
  @ApiBody({ type: SetPasswordDto })
  @Put("auth/set-password")
  async onSetPaaword(@Body() body: SetPasswordDto) {
    return await this.authService.setPassword(body.password, body.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @Put("auth/change-password")
  async onforgetPaaword(@Request() req: any, @Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(
      body.newPassword,
      body.oldPassword,
      req.user.userId
    );
  }
}
