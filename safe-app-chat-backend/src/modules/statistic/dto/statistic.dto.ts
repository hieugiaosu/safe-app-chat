import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class StatisticDto {
    
    @ApiProperty()
    @AutoMap()
    month: number;
    
      
    @AutoMap()
    @ApiProperty()
    count: number
}