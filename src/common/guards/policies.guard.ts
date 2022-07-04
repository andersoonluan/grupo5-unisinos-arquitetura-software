import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { PolicyHandler } from '../interfaces/policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler()
      ) || [];

    if (policyHandlers.length === 0) return true;

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, context)
    );
  }

  private execPolicyHandler(handler: PolicyHandler, context: ExecutionContext) {
    if (typeof handler === 'function') {
      return handler(context);
    }
    return handler.handle(context);
  }
}
