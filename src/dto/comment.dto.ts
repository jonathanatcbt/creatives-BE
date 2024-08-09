import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CommentAddDto {
  @ApiProperty({ example: "Done" })
  @IsNotEmpty()
  @IsString()
  commentText: string;

  @ApiProperty({
    example: "1",
    description: "The id of the project",
  })
  @IsNotEmpty()
  projectId: number;
}
export class CommentUpdateDto {
  @ApiProperty({ example: "Done" })
  @IsNotEmpty()
  @IsString()
  commentText: string;
}
