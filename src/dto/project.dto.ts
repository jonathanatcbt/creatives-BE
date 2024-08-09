import {
  IsNotEmpty,
  IsString,
  IsDate,
  ValidateNested,
  IsNumber,
  IsArray,
  IsBoolean,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
export class StatusDto {
  @ApiProperty({ example: "In Progress", description: "The status name" })
  @IsString()
  name: string;

  @ApiProperty({ example: "true/false" })
  @IsString()
  status: boolean;

  @ApiProperty({
    example: "2023-06-12",
    description: "The start date of the status",
  })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: "2023-07-01",
    description: "The end date of the status",
  })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}

export class ProjectCreateDto {
  @ApiProperty({ example: "Project X", description: "The name of the project" })
  @IsNotEmpty()
  @IsString()
  projectName: string;
  @ApiPropertyOptional()
  @IsNumber()
  companyId: number;

  @ApiPropertyOptional()
  talentName: string;

  @ApiPropertyOptional()
  @IsArray()
  projectOrder: number[];

  @ApiPropertyOptional()
  location: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: "Array of client names",
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  clientId: number[];

  @ApiProperty({
    example: [1, 2, 3],
    description: "Array of client names",
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  editorId: number[];

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  projectType: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  currentStage: string;

  @ApiPropertyOptional({
    example: 1,
    description: "The id of the client",
  })
  @IsString()
  briefLink: string;

  @ApiPropertyOptional({
    example: "videos",
    description: "The folder name for project videos",
  })
  @IsString()
  videoFolderName: string;

  @ApiPropertyOptional({
    example: "https://talentfootage.com",
    description: "The link to the talent footage",
  })
  @IsString()
  talentFootageLink: string;

  @ApiProperty({
    example: "low",
  })
  @IsString()
  priority: string;

  @ApiProperty({
    example: "2023-06-30",
    description: "The created date of the project",
  })
  @IsDate()
  createdDate: Date;

  @ApiProperty({
    example: "2023-06-30",
    description: "The completion date of the project",
  })
  @IsDate()
  completionDate: Date;

  @ApiPropertyOptional({
    example: "Initial Review",
    description: "Initial Review",
  })
  status: string;

  @ApiPropertyOptional({
    example: "finalFolder",
    description: "finalFolder",
  })
  finalFolder: string;

  @ApiPropertyOptional()
  isAbove: boolean;
  @ApiPropertyOptional()
  isBelow: boolean;
  @ApiPropertyOptional()
  order: number;

  // @ApiPropertyOptional({
  //   example: [
  //     {
  //       name: "projectStart",
  //       status: true,
  //       startDate: "2023-06-12",
  //       endDate: "2023-06-30",
  //     },
  //     {
  //       name: "Brief",
  //       status: true,
  //       startDate: "2023-07-01",
  //       endDate: "2023-07-15",
  //     },
  //   ],
  //   description: "The array of status objects",
  //   type: [StatusDto],
  // })
  // @ValidateNested({ each: true })
  // status?: StatusDto[];

  @ApiPropertyOptional()
  completed: boolean;
}
export class ProjectUpdatedStatusDto {
  @ApiProperty({ example: "In Progress", description: "The status name" })
  @IsString()
  name: string;

  @ApiProperty({ example: "true/false" })
  @IsString()
  status: boolean;

  @ApiProperty({
    example: "2023-06-12",
    description: "The start date of the status",
  })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: "2023-07-01",
    description: "The end date of the status",
  })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}

export class ProjectUpdatedDto {
  @ApiProperty({ example: "Project X", description: "The name of the project" })
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @ApiProperty({
    example: "https://brieflink.com",
    description: "The link to the project brief",
  })
  @IsString()
  briefLink: string;

  @ApiProperty({
    example: 1,
    description: "The id for the brand",
  })
  @IsNumber()
  brandId: number;

  @ApiProperty({
    example: "videos",
    description: "The folder name for project videos",
  })
  @IsString()
  videoFolderName: string;

  @ApiProperty({
    example: "https://talentfootage.com",
    description: "The link to the talent footage",
  })
  @IsString()
  talentFootageLink: string;

  @ApiProperty({
    example: "low",
  })
  @IsString()
  priority: string;

  @ApiProperty({
    example: "2023-06-30",
    description: "The completion date of the project",
  })
  @IsDate()
  completionDate: Date;

  @ApiProperty({
    example: [
      {
        id: 1,
        name: "projectStart",
        status: true,
        startDate: "2023-06-12",
        endDate: "2023-06-30",
      },
      {
        id: 2,
        name: "Brief",
        status: true,
        startDate: "2023-07-01",
        endDate: "2023-07-15",
      },
    ],
    description: "The array of status objects",
    type: [ProjectUpdatedStatusDto],
  })
  @ValidateNested({ each: true })
  status?: ProjectUpdatedStatusDto[];
}
export class ProjectStatusUpdateDto {
  @ApiProperty({ example: "", description: "The status name" })
  @IsString()
  name: string;

  @ApiProperty({ example: "", description: "The status name" })
  @IsString()
  projectType: string;

  @ApiProperty({ example: 1 })
  id: number;
}
export class ProjectHideDto {
  @ApiProperty({})
  @IsBoolean()
  hide: boolean;

  @ApiProperty({})
  @IsNumber()
  projectId: number;
}

export class ProjectOrderChangeDto {
  @ApiPropertyOptional()
  @IsArray()
  projectOrder: number[];
}
