import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/game.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getBoard(): string {
    return this.appService.getBoard();
  }
}
