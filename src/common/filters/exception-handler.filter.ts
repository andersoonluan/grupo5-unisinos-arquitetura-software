import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

type ExceptionType = {
  type: string;
  displayMessage: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  debug?: {
    message?: string;
    stack?: string | object;
  };
};

@Catch()
export class ExceptionHandlerFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { path } = ctx.getRequest();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: ExceptionType = {
      type: InternalServerErrorException.name,
      displayMessage: null,
      timestamp: new Date().toISOString(),
      path,
      statusCode,
    };

    // Generic error handling
    if (exception instanceof Error) {
      const { displayMessage = exception.message } = exception as any;

      const stackTrace =
        exception instanceof HttpException
          ? (exception.getResponse() as any)?.debug?.stack
          : (exception as any)?.stack || null;

      responseBody.type = exception.name;
      responseBody.displayMessage = displayMessage;
      responseBody.debug = { stack: stackTrace, message: exception.message };

      if (exception.name === 'InternalServerErrorException') {
        Logger.error(responseBody);
      } else {
        Logger.warn(responseBody);
      }

      // Set original stack trace if it's dev environment
      if (process.env.NODE_ENV === 'production') {
        delete responseBody.debug;
      }
    }

    return response.status(statusCode).send(responseBody);
  }
}
