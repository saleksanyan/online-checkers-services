import { Module } from '@nestjs/common';
import { BoardEntity } from '../entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardEntity])
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class BoardModule {}
