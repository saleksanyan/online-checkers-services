import { InjectRepository } from "@nestjs/typeorm";
import { PlayerEntity } from "../entities/player.entity";
import { FindOneOptions, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PlayerService {
    
    constructor(
		@InjectRepository(PlayerEntity)
		private readonly playerRepository: Repository<PlayerEntity>,
	) {}


    async findOne(playerID: string): Promise<PlayerEntity> {
		const options: FindOneOptions<PlayerEntity> = {
			where: { id: playerID }
		};
		return this.playerRepository.findOne(options);
	}
}