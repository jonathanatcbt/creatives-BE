import { Controller, Put, Body, Post, Param, Delete } from "@nestjs/common";

import { ApiTags, ApiBody, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CommentService } from "./comment.service";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import { CommentAddDto } from "./../dto";
@ApiTags("Comment")
@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Comment add  Successfully",
      },
    },
    description: "It will return with success message",
  })
  @ApiBadRequestResponse({
    schema: {
      type: "object",
      example: {
        status: false,
        message: ["string", "string"],
        error: "Bad Request",
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
  @ApiBody({ type: CommentAddDto })
  async onCreateComment(@Body() commentAddDto: CommentAddDto): Promise<any> {
    return await this.commentService.createComment(commentAddDto);
  }

  // @ApiCreatedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: true,
  //       message: 'Comment Update  Successfully',
  //     },
  //   },
  //   description: 'It will return with success message',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: false,
  //       message: ['string', 'string'],
  //       error: 'Bad Request',
  //     },
  //   },
  //   description: 'It will return Bad Request Error',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: false,
  //       message: 'string',
  //     },
  //   },
  //   description: 'It will return internal server error',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: false,
  //       message: 'Unauthorized',
  //     },
  //   },
  //   description: 'It will return unauthorized error',
  // })
  // @Put(':id')
  // @ApiBody({ type: CommentUpdateDto })
  // async onUpdateComment(
  //   @Body() commentUpdateDto: CommentUpdateDto,
  //   @Param('id') id: number,
  // ): Promise<any> {
  //   return await this.commentService.updateComment(commentUpdateDto, id);
  // }

  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Comment Delete successfully",
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
        message: "Comment not found",
      },
    },
    description: "It will return Comment not found",
  })
  @Delete(":id")
  async onRemove(@Param("id") id: number) {
    return await this.commentService.remove(id);
  }
}
