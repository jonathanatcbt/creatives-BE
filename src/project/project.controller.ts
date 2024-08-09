import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
  Patch,
  Res,
} from "@nestjs/common";
import { Response } from "express";

import { ApiTags, ApiBody, ApiResponse } from "@nestjs/swagger";
import { ProjectService } from "./project.service";
import {
  ProjectCreateDto,
  ProjectHideDto,
  ProjectOrderChangeDto,
  ProjectStatusUpdateDto,
  ProjectUpdatedDto,
} from "./../dto";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
@ApiTags("Project")
@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Project Add successfully",
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
  @Post("")
  @ApiBody({ type: ProjectCreateDto })
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onCreateProject(
    @Body() projectCreateDto: ProjectCreateDto,
    @Request() req: any
    // @Res() res: Response
  ) {
    return await this.projectService.createProject(projectCreateDto, req.user);
  }
  @ApiNotFoundResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: "Data Not Found",
      },
    },
    description: "It will through when data not found",
  })
  @ApiResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "data found",
        data: [],
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
        status: false,
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
  @Get("")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onFindAll(
    @Request() req: any,
    @Res() res: Response,
    @Query("status") status?: boolean,
    @Query("sortBy") sortBy?: string,
    @Query("name") name?: string
  ) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
      projectOrder: [],
      maxId: Number,
    };
    let project;

    project = await this.projectService.findSortByAll(
      status,
      name,
      sortBy,
      req.user.role,
      req.user.userId
    );

    if (project.length > 0) {
      let projectOrderData = await this.projectService.projectOrderData();
      // if (projectOrderData && projectOrderData.length < 1) {
      //   projectOrderData = await this.projectService.projectOrder(project);
      // }

      response.status = true;
      response.message = "Data found";
      response.data = project;
      response.projectOrder = projectOrderData;
      response.maxId = await this.projectService.projectMaxId();
    } else {
      response.status = true;
      response.message = "Data not found";
      response.maxId = await this.projectService.projectMaxId();
    }

    res.json(response);
  }

  // @ApiResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: true,
  //       message: "data found",
  //       data: {},
  //     },
  //   },
  //   description: "It will return data",
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: false,
  //       message: "Bad Request",
  //     },
  //   },
  //   description: "It will return Bad Request Error",
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: false,
  //       message: "string",
  //     },
  //   },
  //   description: "It will return internal server error",
  // })
  // @ApiNotFoundResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: false,
  //       message: "Dat Not Found",
  //     },
  //   },
  //   description: "It will through when data not found",
  // })
  // @Get(":id")
  // async OnFindOne(@Param("id") id: number) {
  //   const response = {
  //     status: true,
  //     message: "Internal Server Error",
  //     data: {},
  //   };
  //   const project = await this.projectService.findOne(id);
  //   if (project) {
  //     response.status = true;
  //     response.message = "Data found";
  //     response.data = project;
  //   } else {
  //     response.status = false;
  //     response.message = "Data not found";
  //   }
  //   return response;
  // }

  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Project Delete successfully",
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
        message: "Project not found",
      },
    },
    description: "It will return Client not found",
  })
  @Put("/delete")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onRemove(@Body() body: any, @Request() req: any) {
    return await this.projectService.remove(
      body.ids,
      body.projectOrder,
      req.user.userId
    );
  }

  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Project Update successfully",
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
  @Put(":id")
  @ApiBody({ type: ProjectCreateDto })
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onUpdate(
    @Param("id") id: number,
    @Body() projectCreateDto: ProjectCreateDto,
    @Request() req: any
  ) {
    return await this.projectService.update(
      id,
      projectCreateDto,
      req.user.userId
    );
  }

  @ApiResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "data found",
        data: [],
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
        status: false,
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
  @Get("searching/byName")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onSearchProjectByName(
    @Query("name") name: string,
    @Request() req: any
  ): Promise<any> {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const projectData = await this.projectService.searchProjectByName(
      name,
      req.user.userId,
      req.user.role
    );
    if (projectData.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = projectData;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }
  // @ApiResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: true,
  //       message: "data found",
  //       data: [],
  //     },
  //   },
  //   description: "It will return data",
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: false,
  //       message: "Bad Request",
  //     },
  //   },
  //   description: "It will return Bad Request Error",
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: false,
  //       message: "string",
  //     },
  //   },
  //   description: "It will return internal server error",
  // })
  // @ApiNotFoundResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: false,
  //       message: "Dat Not Found",
  //     },
  //   },
  //   description: "It will through when data not found",
  // })
  // @Get("getProjectByBrandId/:id")
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  // async onGetprojectByBrand(
  //   @Request() req: any,
  //   @Param("brandId") brandId: number
  // ): Promise<any> {
  //   const response = {
  //     status: true,
  //     message: "Internal Server Error",
  //     data: [],
  //   };
  //   const project = await this.projectService.getprojectByBrand(
  //     req.user.userId,
  //     brandId,
  //     req.user.role
  //   );
  //   if (project.length > 0) {
  //     response.status = true;
  //     response.message = "Data found";
  //     response.data = project;
  //   } else {
  //     response.status = false;
  //     response.message = "Data not found";
  //   }
  //   return response;
  // }

  // @ApiResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: true,
  //       message: "data found",
  //       data: [],
  //     },
  //   },
  //   description: "It will return data",
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: false,
  //       message: "Bad Request",
  //     },
  //   },
  //   description: "It will return Bad Request Error",
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: false,
  //       message: "string",
  //     },
  //   },
  //   description: "It will return internal server error",
  // })
  // @ApiNotFoundResponse({
  //   schema: {
  //     type: "object",
  //     example: {
  //       status: false,
  //       message: "Dat Not Found",
  //     },
  //   },
  //   description: "It will through when data not found",
  // })
  // @Get("project/getLoginUserProject")
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  // async onLoginUserproject(
  //   @Request() req: any,
  //   @Query("sort_by") sortBy?: string
  // ): Promise<any> {
  //   const response = {
  //     status: true,
  //     message: "Internal Server Error",
  //     data: [],
  //   };
  //   let project;
  //   if (sortBy) {
  //     project = await this.projectService.getLoginUserProjectSortBy(
  //       req.user.userId,
  //       req.user.role,
  //       sortBy
  //     );
  //   } else
  //     project = await this.projectService.getLoginUserProject(
  //       req.user.userId,
  //       req.user.role
  //     );
  //   if (project.length > 0) {
  //     response.status = true;
  //     response.message = "Data found";
  //     response.data = project;
  //   } else {
  //     response.status = false;
  //     response.message = "Data not found";
  //   }
  //   return response;
  // }
  @Patch("status")
  @ApiBody({})
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onUpdateProjectStatus(
    @Body() projectStatusUpdateDto: any,
    @Request() req: any
  ) {
    return await this.projectService.updateProjectMutipleStatus(
      projectStatusUpdateDto,
      req.user.userId
    );
  }
  @Get("status/count")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onCountProjectStatus(@Request() req: any) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };

    const project = await this.projectService.countStatus(
      req.user.userId,
      req.user.role
    );
    if (project.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = project;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }

  @Get("status/counts")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onCountProjectStatuses(@Request() req: any) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };

    const project = await this.projectService.countStatuss(
      req.user.userId,
      req.user.role
    );
    if (project.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = project;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }

  @Put("admin/status")
  @ApiBody({ type: ProjectStatusUpdateDto })
  async onUpdateFinalReviw(
    @Body() projectStatusUpdateDto: ProjectStatusUpdateDto
  ) {
    return await this.projectService.updateStatuses(projectStatusUpdateDto);
  }

  @Patch("drag-drop/status")
  @ApiBody({})
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onUpdateDragDropStatus(
    @Body() projectStatusUpdateDto: any,
    @Request() req: any
  ) {
    return await this.projectService.updateStagesMultiPleProject(
      projectStatusUpdateDto,
      req.user.userId
    );
  }

  @Patch("changeStatus")
  @ApiBody({ type: ProjectHideDto })
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  async onUpdateProejctStatus(
    @Body() projectHideDto: ProjectHideDto
    // @Request() req: any
  ) {
    return await this.projectService.projectHide(projectHideDto);
    // return await this.projectService.updateStages(
    //   projectStatusUpdateDto,
    //   req.user.userId
    // );
  }

  @Patch("change-project-order")
  @ApiBody({ type: ProjectOrderChangeDto })
  async onUpdateProejctOrder(
    @Body() projectOrderChangeDto: ProjectOrderChangeDto
    // @Request() req: any
  ) {
    return await this.projectService.projectOrderChnage(projectOrderChangeDto);
    // return await this.projectService.updateStages(
    //   projectStatusUpdateDto,
    //   req.user.userId
    // );
  }

  @Patch("update-editor")
  @ApiBody({})
  async onUpdateProjectEditor(
    @Body() projectEditorId: any
    // @Request() req: any
  ) {
    return await this.projectService.projectOrderChnage(projectEditorId);
  }
}
