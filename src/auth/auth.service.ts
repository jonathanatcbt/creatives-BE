import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { LoginUserDto } from "./../dto";
import { User } from "./../entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "./../helper/email.service";
import { config } from "dotenv";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}
  async userLogin(loginDto: LoginUserDto): Promise<any> {
    const user = await this.userService._findUsers("email", loginDto.email);
    if (!user) {
      return {
        status: false,
        message: "Invalid credentials",
      };
    }
    const isPasswordValid = await this.userService._validatePassword(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        status: false,
        message: "Invalid credentials",
      };
    } else if (!user.isActive) {
      return {
        status: false,
        message: "Login Failed: Your account is currently inactive",
      };
    }
    const editorNotifications = await this.userService._findEdiotNoti(
      "email",
      loginDto.email
    );
    let company = null;
    if (user.company) company = user.company.id;
    return {
      status: true,
      message: "Successfully Login",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        is_super_admin: user.is_super_admin,
        isActive: user.isActive,
        company,
        accessToken: await this.generateAccessToken(user),
      },
    };
  }
  private async generateAccessToken(user: User): Promise<any> {
    const payload = { userId: user.id, role: user.role };
    const expiresIn = "14d"; // Token expires after 5 hours

    return this.jwtService.sign(payload, { expiresIn });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    // Verify the refresh token and retrieve the associated user information
    const decodedRefreshToken = await this.jwtService.verifyAsync(refreshToken);
    const { userId } = decodedRefreshToken;
    const user = await this.userService._findUser("id", userId);

    await this.generateAccessToken(user);
    // Generate a new access token for the user
    // Assuming user ID and email are stored in the refresh token

    const newAccessToken = await this.generateAccessToken(user);

    // Return the new access token
    return newAccessToken;
  }

  async sendUrl(email: string): Promise<any> {
    const user = await this.userService._findUser("email", email);
    if (!user)
      return {
        status: false,
        message: "User does not exist",
      };
    const token = await this.generateAccessToken(user);
    const resetLink = `${process.env.FROETEND_URL}/forget-password/${token}`;

    const subject = "Forget Password";
    const html = `
      <p>Click on the link below to set your password:</p>
      <p><a href="${resetLink}" style="text-decoration: underline;">${process.env.FROETEND_URL}/forget-password/${token}}</a></p>
    `;

    await this.emailService.sendEmail(email, subject, html);
    return {
      status: true,
      message: "Invite Send  Successfully",
    };
  }
  async setPassword(password, id): Promise<any> {
    return await this.userService._setPasswords(password, id);
  }

  async changePassword(newPassword, oldPassword, id): Promise<any> {
    const user = await this.userService._findUser("id", id);

    const isPasswordValid = await this.userService._validatePassword(
      oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      return {
        status: false,
        message: "Invalid old Password",
      };
    }
    return await this.userService.changePassword(newPassword, id);
  }
}
