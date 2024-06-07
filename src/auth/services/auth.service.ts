import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PlayerService } from 'src/player/services/player.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly playerService: PlayerService,
        private readonly jwtService: JwtService,
      ) {}

  async signIn(
    playerID: string,
  ): Promise<{ access_token: string }> {
    const player = await this.playerService.findOne(playerID);
    const payload = { sub: player.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}