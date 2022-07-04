import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateHistoryDto {

  @ApiProperty()
  @IsNotEmpty()
  search: string;

  @ApiProperty()
  @IsNotEmpty()
  provider: string;

  @ApiProperty()
  @IsNotEmpty()
  response: string;

}
