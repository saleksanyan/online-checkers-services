import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import { PlayerService } from 'src/player/services/player.service';
import { PlayerModule } from 'src/player/modules/player.module';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: '60s' }, 
    }),
    PlayerModule
  ],
  providers: [AuthService],
  controllers: [AbortController],
  exports: [AuthService, JwtModule, PlayerService],
})
export class AuthModule {}
