import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import externalConfig from './config/external.config';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { UserModule } from './modules/user/user.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';
import { StatisticModule } from './modules/statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, externalConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('database.mongodb_uri'),
        }
      },
      inject: [ConfigService],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    AuthModule,
    UserModule,
    FirebaseModule,
    ChatModule,
    AiModule,
    AdminModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
