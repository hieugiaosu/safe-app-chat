import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty()
    @AutoMap()
    _id: string;

    @ApiProperty()
    @AutoMap()
    firstName: string;

    @ApiProperty()
    @AutoMap()
    lastName: string;

    @ApiProperty()
    @AutoMap()
    email: string;

    @ApiProperty()
    @AutoMap()
    createdAt: Date;

    @ApiProperty()
    @AutoMap()
    updatedAt: Date;

    @ApiProperty()
    @AutoMap()
    role: string;

    @ApiProperty()
    @AutoMap()
    isActive: boolean;

    // Constructor để khởi tạo giá trị mặc định cho role và isActive
    constructor(partial: Partial<UserDto> = {}) {
        Object.assign(this, partial);
        this.role = this.role || "0";  // Nếu role không được truyền, mặc định là "0"
        this.isActive = this.isActive !== undefined ? this.isActive : true; // Nếu isActive không được truyền, mặc định là true
    }
}