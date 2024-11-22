import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class BasePaginationDto {
  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  cursor?: string;
}

export class BaseResponseDto<T> {
  @ApiProperty()
  data: T;

  @ApiProperty()
  metadata?: any;
}