import { Module } from '@nestjs/common';
import { AppController } from './game.controller';
import { AppService } from './game.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
