import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from './history.service';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as np from 'nestjs-paginate';

jest.mock('nestjs-paginate');

describe('HistoryService', () => {
  let service: HistoryService;
  let repository: Repository<History>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: getRepositoryToken(History),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(HistoryService);
    repository = module.get(getRepositoryToken(History));
  });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all searches', async () => {
      const paginateSpy = jest.spyOn(np, 'paginate');
      const queryParams = {
        limit: 5,
        page: 1,
        path: '/api/v1/searches',
      };
      await service.findAll(queryParams);
      expect(paginateSpy).toBeCalledWith(
        queryParams,
        repository,
        expect.anything()
      );
    });
  });

  describe('findOne()', () => {
    it('should find history by displayId', async () => {
      const search = {
        displayId: 'searched-id-1',
        search: 'Wake Me Up Music',
        provider: 'YOUTUBE',
        response: {
          search: 'Wake Me Up',
          response: 'Simple Response Example'
        },
      };
      repository.findOneOrFail = jest.fn().mockResolvedValue(search);

      const response = await service.findOne('searched-id-1');

      expect(response).toEqual(search);
      expect(repository.findOneOrFail).toBeCalledWith({
        displayId: 'searched-id-1',
      });
    });
  });

  describe('create()', () => {
    it('should create a new history and return it', async () => {
      const newSearch = {
        displayId: 'searched-id-1',
        search: 'Wake Me Up Music',
        provider: 'YOUTUBE',
        response: JSON.stringify({
          search: 'Wake Me Up',
          response: 'Simple Response Example'
        }),
      };
      repository.save = jest.fn().mockResolvedValue(newSearch);

      const historyDto = {
        search: 'Wake Me Up Music',
        provider: 'YOUTUBE',
        response: JSON.stringify({
          search: 'Wake Me Up',
          response: 'Simple Response Example'
        }),
      };
      const history = await service.create(historyDto);

      expect(history).toEqual(newSearch);
      expect(repository.save).toBeCalledWith(historyDto);
    });
  });

  describe('update()', () => {
    it('should update existing record and return it', async () => {
      const HISTORY_ID = 'ed87a23e-1b16-4f03-909d-bb2832e52e9a';

      const updateHistory = {
        id: HISTORY_ID,
        search: 'Wake Me Up Music',
        provider: 'YOUTUBE',
        response: JSON.stringify({
          search: 'Wake Me Up',
          response: 'Simple Response Example'
        }),
      };
      repository.save = jest.fn().mockResolvedValue(updateHistory);
      repository.findOneOrFail = jest.fn().mockResolvedValue(updateHistory);

      const updateHistoryDto = {
        search: 'Wake Me Up Music Updated!',
        provider: 'YOUTUBE',
        response: JSON.stringify({
          search: 'Wake Me Up',
          response: 'Simple Response Example'
        }),
      };
      const product = await service.update(HISTORY_ID, updateHistoryDto);

      expect(product).toEqual(updateHistory);
      expect(repository.save).toBeCalledWith(updateHistory);
      expect(repository.findOneOrFail).toBeCalledWith({
        displayId: HISTORY_ID, deletedAt: null
      });
    });
  });
});
