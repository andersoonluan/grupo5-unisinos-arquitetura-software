import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Connection } from 'typeorm';
import { PoliciesGuard } from './common/guards/policies.guard';
import { HealthController } from './health/health.controller';
import throttlerConfig from './throttler.config';
import ormConfig = require('./ormconfig');
import { HistoryModule } from './history/history.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ThrottlerModule.forRoot(throttlerConfig),
    ScheduleModule.forRoot(),
    TerminusModule,
    HistoryModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
