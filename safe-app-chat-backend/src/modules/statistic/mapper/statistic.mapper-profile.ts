import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { Message } from "../message.schema";
import { StatisticDto } from "../dto/statistic.dto";

@Injectable()
export class StatisticMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: any) => {
      createMap(
        mapper,
        Message,
        StatisticDto,
        forMember(
          (destination) => destination.month.toString(),
          mapFrom((source) => source._id.toString()),
        ),
      );
    };
  }
}