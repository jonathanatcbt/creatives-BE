import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateClientDto {
  @ApiProperty({ example: "John Doe", description: "The name of the client" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: "johndoe@example.com",
    description: "The email of the client",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "123456",
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: "123456",
  })
  image: string;
}
