import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'grupo_5_api',
  schema: process.env.DATABASE_SCHEMA || 'public',
  entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
  subscribers: ['dist/src/observers/subscribers/*.subscriber.js'],
  migrationsRun: true,
  logging: ['error', 'info', 'schema'],
  migrations: [
    __dirname + '/migration/**/*.ts',
    __dirname + '/migration/**/*.js',
  ],
  synchronize: false,
  cli: {
    migrationsDir: 'src/migration',
    subscribersDir: 'src/observers/subscribers',
  },
};

export = ormConfig;
