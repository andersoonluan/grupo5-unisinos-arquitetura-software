import {  Injectable, Logger } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { History } from './entities/history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginated, PaginateConfig, PaginateQuery, paginate, FilterOperator } from 'nestjs-paginate';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  private readonly paginateConfig: PaginateConfig<History> = {
    sortableColumns: ['createdAt', 'updatedAt'],
    defaultSortBy: [['createdAt', 'DESC']],
    searchableColumns: ['search'],
    maxLimit: 100,
    defaultLimit: 10,
    filterableColumns: {
      search: [FilterOperator.EQ],
      provider: [FilterOperator.EQ],
    },
  };

  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>
  ) { }

  async create(createHistoryDto: CreateHistoryDto): Promise<History> {
    const history = new History();
    history.search = createHistoryDto.search;
    history.provider = createHistoryDto.provider;
    history.response = createHistoryDto.response;
    return await this.historyRepository.save(history);
  }

  async update(displayId: string, updateHistoryDto: UpdateHistoryDto): Promise<History> {
    this.logger.log(`update history by id ${displayId}`);
    const history = await this.historyRepository.findOneOrFail({ displayId: displayId, deletedAt: null });
    history.search = updateHistoryDto.search;
    history.provider = updateHistoryDto.provider;
    history.response = updateHistoryDto.response;
    return await this.historyRepository.save(history);
  }

  async delete(displayId: string): Promise<any> {
    this.logger.log(`delete history by id ${displayId}`);
    // validate if the entity exist in the database.
    await this.historyRepository.findOneOrFail({ displayId: displayId, deletedAt: null });
    // if exist, delete and return the result.
    return await this.historyRepository.softDelete({ displayId: displayId, deletedAt: null });
  }

  async findAll(queryParams: PaginateQuery): Promise<Paginated<History>> {
    this.logger.log(`returning paginated history query result`, queryParams);
    return await paginate(queryParams, this.historyRepository, this.paginateConfig);
  }

  async findOne(displayId: string): Promise<History> {
    return await this.historyRepository.findOneOrFail({ displayId: displayId });
  }
}
