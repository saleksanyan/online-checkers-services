import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from '../entities/player.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PlayerEntity]),
    ],
    controllers: [],
    providers: [],
})
export class PlayerModule {}
