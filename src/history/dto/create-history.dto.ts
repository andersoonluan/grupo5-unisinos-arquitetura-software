import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateHistoryDto {

  @ApiProperty()
  @IsNotEmpty()
  search: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  response: string;

}
