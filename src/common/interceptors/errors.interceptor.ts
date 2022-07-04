import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

enum QUERY_ERROR {
  DUPLICATE_ENTRY = '23505',
}

type ExceptionMappingItem = [any, string];
type ExceptionMappings = {
  types?: unknown[];
  resolveTo: (err: unknown) => ExceptionMappingItem | ExceptionMappingItem;
};

const defaultError: ExceptionMappingItem = [
  InternalServerErrorException,
  'An internal error occurred, please try again later',
];

const ExceptionsMapping: ExceptionMappings[] = [
  {
    types: [EntityNotFoundError, NotFoundException],
    resolveTo: (err) => {
      return [
        NotFoundException,
        'The requested resource was not found',
      ]
    },
  },
  {
    types: [BadRequestException],
    resolveTo: (err: any) => {
      if (
        err?.response?.message === 'Validation failed (uuid v4 is expected)'
      ) {
        return [BadRequestException, 'Invalid uuid v4 provided'];
      }
      return [BadRequestException, err?.response?.message];
    },
  },
  {
    types: [QueryFailedError],
    resolveTo: (err: Record<string, unknown>) => {
      switch (err?.code) {
        case QUERY_ERROR.DUPLICATE_ENTRY:
          return [
            BadRequestException,
            'There is already an registered record with the provided attributes',
          ];
        default:
          return defaultError;
      }
    },
  },
];

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((exception: Error) => {
        const { resolveTo } = ExceptionsMapping.find(({ types = [] }) =>
          types.includes(Object.getPrototypeOf(exception).constructor)
        ) || { resolveTo: () => defaultError };

        const mappedItem = resolveTo(exception);

        const [ExceptionInstance, displayMessage] = mappedItem;

        const error = new ExceptionInstance({ debug: exception });
        error.displayMessage = displayMessage;

        return throwError(() => error);
      })
    );
  }
}
