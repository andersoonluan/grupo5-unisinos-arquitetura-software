import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import ormConfig = require('./ormconfig');

seeder({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
  ],
}).run([]);
