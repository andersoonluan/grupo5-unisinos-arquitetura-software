import { ThrottlerModuleOptions } from '@nestjs/throttler';

const throttlerConfig: ThrottlerModuleOptions = {
  ttl: parseInt(process.env.THROTTLER_RATE_LIMIT) || 60,
  limit: parseInt(process.env.THROTTLER_TTL) || 20,
};

export default throttlerConfig;
