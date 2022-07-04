import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    UseInterceptors,
  } from '@nestjs/common';
  import { HistoryService } from './history.service';
  import { CreateHistoryDto } from './dto/create-history.dto';
  import { History } from './entities/history.entity';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { EntityNotFoundError } from 'typeorm';
  import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
  import { UpdateHistoryDto } from './dto/update-history.dto';
import search from 'src/common/api/youtube';

  @ApiTags('searches')
  @Controller('searches')
  export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @ApiOperation({ summary: 'Create a new history search' })
    @ApiResponse({
      status: 201,
      description: 'Returns newly created history search',
    })
    @Post()
    async create(
      @Body() createHistoryDto: CreateHistoryDto
    ): Promise<History> {
      const result = await search(createHistoryDto.search);
      const createDto = new CreateHistoryDto();
      createDto.search = createHistoryDto.search;
      createDto.provider = 'Youtube';
      createDto.response = result;
      await this.historyService.create(createDto);
      return result;
    }

    @ApiOperation({ summary: 'Update History Search' })
    @ApiResponse({
      status: 200,
      description: 'Returns history updated',
    })
    @Put(':id')
    async update(
      @Param(
        'id',
        new ParseUUIDPipe({
          version: '4',
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        })
      )
      id: string,
      @Body() updateHistoryDto: UpdateHistoryDto
    ): Promise<History> {
      try {
        return await this.historyService.update(id, updateHistoryDto);
      } catch (e) {
        if (e instanceof EntityNotFoundError) {
          throw new NotFoundException(`Could not find history by id: ${id}`);
        }
      }
      return null;
    }

    @ApiOperation({ summary: 'Get all searches history' })
    @ApiResponse({ status: 200, description: 'Returns all searches history' })
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async findAll(
      @Paginate() queryParams: PaginateQuery
    ): Promise<Paginated<History>> {
      return await this.historyService.findAll(queryParams);
    }

    @ApiOperation({ summary: 'Get history search by id' })
    @ApiResponse({ status: 200, description: 'Return history data' })
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    async findOne(@Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      })
    )
    id: string): Promise<History> {
      try {
        return await this.historyService.findOne(id);
      } catch (e) {
        if (e instanceof EntityNotFoundError) {
          throw new NotFoundException(`Could not find history by id: ${id}`);
        }
      }
      return null;
    }

    @ApiOperation({ summary: 'Delete History By Id' })
    @ApiResponse({ status: 204, description: 'Return History Deleted Status' })
    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      })
    )
    id: string): Promise<any> {
      try {
        return await this.historyService.delete(id);
      } catch (e) {
        if (e instanceof EntityNotFoundError) {
          throw new NotFoundException(`Could not find history by id: ${id}`);
        }
      }
      return null;
    }
  }
