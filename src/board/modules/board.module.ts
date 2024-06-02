import { Module } from '@nestjs/common';
import { Board } from '../entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board])
  ],
  controllers: [],
  providers: []
})
export class BoardModule {}
