import { ExecutionContext } from '@nestjs/common';

export interface IPolicyHandler {
  handle(context: ExecutionContext): boolean;
}

type PolicyHandlerCallback = (context: ExecutionContext) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
