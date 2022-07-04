import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { PublicEndpoint } from '../common/decorators/public-endpoint.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  @PublicEndpoint()
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
