import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddBrandDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the editor' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email of the editor',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
