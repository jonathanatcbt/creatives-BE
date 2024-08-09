import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEditorDto {
  @ApiProperty({ example: "John Doe", description: "The name of the editor" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: "johndoe@example.com",
    description: "The email of the editor",
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
    example: "",
  })
  image: string;
}

export class UpdateProjectEditorDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty({})
  @IsArray()
  editorId: [];
}
