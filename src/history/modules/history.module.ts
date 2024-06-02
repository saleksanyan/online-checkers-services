import { Module } from '@nestjs/common';
import { History } from '../entities/history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([History])
  ],
  controllers: [],
  providers: []
})
export class HistoryModule {}