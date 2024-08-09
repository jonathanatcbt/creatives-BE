import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  Request,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { EditorService } from "./editor.service";
import { UpdateEditorDto, UpdateProjectEditorDto } from "./../dto";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
@ApiTags("Editor")
@Controller("")
export class EditorController {
  constructor(private readonly editorService: EditorService) {}
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
        statusCode: 500,
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
  @Get("editor")
  async onFindAll() {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const editor = await this.editorService.findAll();
    if (editor.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = editor;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }

  @ApiResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "data found",
        data: {},
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
        statusCode: 500,
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
  @Get("editor/:id")
  async OnFindOne(@Param("id") id: string) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: {},
    };
    const editor = await this.editorService.findOne(id);
    if (editor) {
      response.status = true;
      response.message = "Data found";
      response.data = editor;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }

  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Editor Update successfully",
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
  @ApiNotFoundResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: "email already exist",
      },
    },
    description: "It will through already exist message",
  })
  @Put("editor/:id")
  @ApiBody({ type: UpdateEditorDto })
  async onUpdate(
    @Param("id") id: number,
    @Body() updateEditorDto: UpdateEditorDto
  ) {
    return await this.editorService._update(id, updateEditorDto);
  }
  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Editor Delete successfully",
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
        message: "Editor not found",
      },
    },
    description: "It will return Client not found",
  })
  @Delete("editor/:id")
  async oRemove(@Param("id") id: number) {
    return await this.editorService.remove(id);
  }

  @ApiResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "data found",
        data: {},
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
        statusCode: 500,
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
  @Get("editor/getEditorProject/:editorId")
  async OnFindEditorProject(@Param("editorId") editorId: number) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const clientProject = await this.editorService.findEditorProject(editorId);
    if (clientProject.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = clientProject;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @Get("getAdminEditor")
  async onFindAdminEditor(@Request() req: any) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const editor = await this.editorService.findAdminEditor(req.user.userId);
    if (editor.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = editor;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }

  @ApiBearerAuth()
  @Patch("editor/changeEditor")
  @ApiBody({ type: UpdateProjectEditorDto })
  async onChangeEditor(@Body() updateProjectEditorDto: UpdateProjectEditorDto) {
    return await this.editorService.changeEditor(updateProjectEditorDto);
    // nst editor = await this.editorService.findAdminEditor(req.user.userId);
    // if (editor.length > 0) {
    //   response.status = true;
    //   response.message = "Data found";
    //   response.data = editor;
    // } else {
    //   response.status = false;
    //   response.message = "Data not found";
    // }
    // return response;
  }

  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @Get("getAdminEditors")
  async onFindAdminEditors(@Request() req: any) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const editor = await this.editorService.findAdminEditors(req.user.userId);
    if (editor.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = editor;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }
}
