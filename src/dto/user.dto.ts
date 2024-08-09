import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "John Doe", description: "The name of the user" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: "johndoe@example.com",
    description: "The email of the user",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "The password of the user",
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  isActive: boolean;
  @IsString()
  role: string;

  @ApiPropertyOptional({
    example: "image",
    description: "link of image",
  })
  image: string;

  @ApiPropertyOptional({})
  isAccepted: boolean;
}
export class AddUserDto {
  @ApiProperty({
    example: "johndoe@example.com",
    description: "The email of the user",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiPropertyOptional({})
  name: string;
  @ApiPropertyOptional({})
  company: string;

  @ApiPropertyOptional({})
  companyId: number;

  @ApiPropertyOptional({})
  companyName: string;
}

export class UserDeatilsUpdateDto {
  @ApiPropertyOptional({
    example: "password123",
  })
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsString()
  role: string;

  @ApiPropertyOptional()
  @IsString()
  companyId: string;

  @ApiPropertyOptional({
    example: "password123",
  })
  @IsString()
  email: string;

  @ApiPropertyOptional({
    example: "John Doe",
    description: "The name of the user",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: "image",
    description: "link of image",
  })
  image: string;
}
