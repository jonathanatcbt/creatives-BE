import {
  Controller,
  Put,
  Get,
  Body,
  Post,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";

import { ApiTags, ApiBody, ApiUnauthorizedResponse } from "@nestjs/swagger";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { BrandService } from "./brand.service";
import { AddBrandDto } from "./../dto";
@ApiTags("Brand")
@Controller("")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiCreatedResponse({
    schema: {
      type: "object",
      example: {
        status: true,
        message: "Brand add  Successfully",
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
  @Post("brand")
  @ApiBody({ type: AddBrandDto })
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onCreateComment(
    @Body() addBrandDto: AddBrandDto,
    @Request() req: any
  ): Promise<any> {
    if (req.user.role != "editor") {
      return {
        status: false,
        message: "Sorry this feature allow just Editor",
      };
    }
    return await this.brandService.addBrand(req.user.userId, addBrandDto);
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
  @Get("brand/:brandId")
  async onBrand(@Param("brandId") brandId: number) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: {},
    };
    const brand = await this.brandService.findBrand(brandId);
    if (brand) {
      response.status = true;
      response.message = "Data found";
      response.data = brand;
    } else {
      response.status = true;
      response.message = "Data not found";
      response.data = {};
    }
    return response;
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
  @Get("brand")
  async onGetAllBrand() {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const brand = await this.brandService.findAllBrand();
    if (brand.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = brand;
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
  @Get("getLoginEditorBrand")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  async onGetLoginEditorBrand(@Request() req: any) {
    const response = {
      status: true,
      message: "Internal Server Error",
      data: [],
    };
    const brand = await this.brandService.findLoginEdiotrbrand(req.user.userId);
    if (brand.length > 0) {
      response.status = true;
      response.message = "Data found";
      response.data = brand;
    } else {
      response.status = true;
      response.message = "Data not found";
    }
    return response;
  }
}
