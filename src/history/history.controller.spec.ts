import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { NotFoundException } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

describe('HistoryController', () => {
  let controller: HistoryController;
  let service: HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [
        HistoryService,
        {
          provide: HistoryService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<HistoryController>(HistoryController);
    service = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it('should find history by displayId', () => {
      const history = {
        id: "history-id-1",
        displayId: "history-display-id-1",
        search: 'Wake Me Up Music',
        provider: 'YOUTUBE',
        response: JSON.stringify({
          search: 'Wake Me Up',
          response: 'Simple Response Example'
        }),
      }
      service.findOne = jest.fn().mockResolvedValue(history);
      const response = controller.findOne('history-id-1');
      expect(service.findOne).toHaveBeenCalledWith('history-id-1');
      response.then((receivedHistory) => {
        expect(receivedHistory).toEqual(history);
      });
    });

    it('should return 404 if displayId is not found', async () => {
      service.findOne = jest.fn().mockResolvedValue(undefined);
      const response = controller.findOne('bad-id');
      expect(service.findOne).toHaveBeenCalledWith('bad-id');
      response.catch((reason) => {
        expect(reason).toEqual(
          new NotFoundException('Could not find history by id: bad-id')
        );
      });
    });
  });

  describe('findAll()', () => {
    it('should find all searches', () => {
      const allSearches = {
        items: [
          {
            id: "history-id-1",
            displayId: "history-display-id-1",
            search: 'Wake Me Up Music',
            provider: 'YOUTUBE',
            response: JSON.stringify({
              search: 'Wake Me Up',
              response: 'Simple Response Example'
            }),
          },
          {
            id: "history-id-2",
            displayId: "history-display-id-2",
            search: 'Top 5 Brazilian Musics',
            provider: 'YOUTUBE',
            response: JSON.stringify({
              search: 'Top 5 Brazilian Musics',
              response: 'Simple Response Example'
            }),
          }
        ],
        meta: {
          totalItems: 2,
          itemsPerPage: 5,
          totalPages: 2,
          currentPage: 1,
        },
        links: {
          first: '/api/v1/searches?page=1&limit=5',
          previous: '',
          current: '/api/v1/searches?page=1&limit=5',
          next: '',
          last: '/api/v1/searches?page=1&limit=5',
        },
      };
      service.findAll = jest.fn().mockResolvedValue(allSearches);

      const queryParams = {
        path: '',
        limit: 5,
        page: 1,
      };
      const response = controller.findAll(queryParams);
      expect(service.findAll).toBeCalledWith(queryParams);
      response.then((searches) => {
        expect(searches).toEqual(allSearches);
      });
    });
  });

  describe('create()', () => {
    it('should create a new history/search and return new resource', () => {
      const newHistory = {
        id: "history-id-1",
            displayId: "history-display-id-1",
            search: 'Wake Me Up Music',
            provider: 'YOUTUBE',
            response: JSON.stringify({
              search: 'Wake Me Up',
              response: 'Simple Response Example'
        }),
      };
      service.create = jest.fn().mockResolvedValueOnce(newHistory);

      const newHistoryDto: CreateHistoryDto = {
        search: 'Wake Me Up Music',
        provider: 'YOUTUBE',
        response: JSON.stringify({
          search: 'Wake Me Up',
          response: 'Simple Response Example'
    }),
      };
      const response = controller.create(newHistoryDto);

      response.then((createdHistory) => {
        expect(createdHistory.id).toEqual(newHistory.id);
      });
      expect(service.create).toHaveBeenCalledWith(newHistoryDto);
    });
  });

  describe('update()', () => {
    it('should update history and return the history updated', () => {
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
      service.update = jest.fn().mockResolvedValueOnce(updateHistory);

      const updateHistoryDto: UpdateHistoryDto = {
        search: 'Wake Me Up Music',
        provider: 'YOUTUBE',
        response: JSON.stringify({
          search: 'Wake Me Up',
          response: 'Simple Response Example'
    }),
      };
      const response = controller.update(HISTORY_ID, updateHistoryDto);

      response.then((updateHistoryData) => {
        expect(updateHistoryData.id).toEqual(updateHistory.id);
      });
      expect(service.update).toHaveBeenCalledWith(HISTORY_ID, updateHistoryDto);
    });
  });

  describe('delete()', () => {
    it('should delete history by id', () => {
      service.delete = jest.fn().mockResolvedValueOnce({});
      const response = controller.delete('ed87a23e-1b16-4f03-909d-bb2832e52e9a');
      response.then((result) => {
        expect(result).toEqual({});
      });
      expect(service.delete).toHaveBeenCalledWith('ed87a23e-1b16-4f03-909d-bb2832e52e9a');
    });

    it('should return 404 if id is not found', () => {
      service.delete = jest.fn().mockResolvedValue(undefined);
      const response = controller.delete('bad-id');
      expect(service.delete).toHaveBeenCalled();
      response.catch((reason) => {
        expect(reason).toEqual(
          new NotFoundException('Could not find history by id: bad-id')
        );
      });
    });
  });
});
