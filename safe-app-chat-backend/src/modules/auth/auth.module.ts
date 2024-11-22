import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('auth.jwtSecretKey'),
          signOptions: { expiresIn: configService.get('auth.jwtExpiredTime') },
        }
      },
      inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
