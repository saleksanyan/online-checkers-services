// AuthModule
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PlayerModule } from 'src/player/modules/player.module'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from 'src/player/entities/player.entity';

dotenv.config({ path: `.env || local` });
const configService: ConfigService = new ConfigService();

@Module({
    imports: [
        PlayerModule, 
        TypeOrmModule.forFeature([PlayerEntity]), 
        JwtModule.register({
            secret: configService.get<string>('JWT_SECRET_KEY'),
            signOptions: { expiresIn: '24h' }
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService, TypeOrmModule] 
})
export class AuthModule {}
