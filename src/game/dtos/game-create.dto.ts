import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GameCreateDto {
  
  @ApiProperty()
  @IsNotEmpty()
    gameToken: string;
}