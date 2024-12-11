import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { User } from "../user.schema";
import { UserDto } from "../dto/user.dto";

@Injectable()
export class AdminMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: any) => {
      createMap(
        mapper,
        User,
        UserDto,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id.toString()),
        ),
      );
    };
  }
}