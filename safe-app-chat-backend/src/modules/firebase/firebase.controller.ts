import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiProperty,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { FirebaseService } from './firebase.service';

class FirebaseSetDto {
  @ApiProperty()
  path: string;
  @ApiProperty()
  value: unknown;
}

@ApiTags('Firebase')
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @ApiOperation({
    summary: 'Set data in Firebase Realtime Database',
    description:
      'Stores a value in the Firebase Realtime Database at the specified path.',
  })
  @ApiResponse({
    status: 200,
    description: 'The value was successfully set in Firebase.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('set')
  async setData(@Body() body: FirebaseSetDto) {
    return await this.firebaseService.set(body.path, body.value);
  }


  @ApiOperation({
    summary: 'Get data from Firebase Realtime Database',
    description:
      'Retrieves a value from the Firebase Realtime Database at the specified path.',
  })
  @ApiResponse({
    status: 200,
    description: 'The value was successfully retrieved from Firebase.',
  })
  @ApiResponse({
    status: 404,
    description: 'The specified path was not found in Firebase.',
  })
  @ApiParam({
    name: 'path',
    description:
      'The path in the Firebase Realtime Database from which to retrieve data.',
    type: String,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':path')
  async getData(@Param('path') path: string) {
    return await this.firebaseService.get(path);
  }
}
