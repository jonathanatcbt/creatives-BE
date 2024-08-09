import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SetPasswordDto {
  @ApiProperty({
    example: "1",
    description: "The id of the user",
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: "password123",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
export class SetPasswordDtos {
  @ApiProperty({
    example: "1",
    description: "The id of the user",
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: "password123",
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: "John Doe", description: "The name of the user" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: "image",
    description: "link of image",
  })
  image: string;
}

export class ChangePasswordDto {
  @ApiProperty({})
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: "password123",
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
export class LoginUserDto {
  @ApiProperty({ example: "johndoe@example.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
