import { Module } from '@nestjs/common';
import { HistoryEntity } from '../entities/history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryEntity])
  ],
  controllers: [],
  providers: []
})
export class HistoryModule {}