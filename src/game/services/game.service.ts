import { Injectable } from '@nestjs/common';
import Game from 'src/lib/Game';

@Injectable()
export class AppService {
  getBoard(): string {
    return '';
  }
}
