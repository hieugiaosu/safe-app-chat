import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseController } from './firebase.controller';
import { FirebaseRealtimeDbRepository } from './firebase.repository';
import { FirebaseService } from './firebase.service';

const firebaseRealtimeDBProvider = {
  provide: 'FIREBASE_REALTIME_DB_ADMIN_APP',
  useFactory: (configService: ConfigService) => {
    const firebaseConfig = configService.get<admin.ServiceAccount>('database.firebaseConfig');
    const realtimeDbUri = configService.get<string>('database.firebaseRealtimeDatabaseURL');

    if (!firebaseConfig || !realtimeDbUri) {
      throw new Error('Firebase configuration is missing');
    }

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: realtimeDbUri,
    });
  },
  inject: [ConfigService],
};

@Module({
  providers: [
    firebaseRealtimeDBProvider,
    FirebaseService,
    {
      provide: 'IFirebaseRealtimeDbRepository',
      useClass: FirebaseRealtimeDbRepository,
    },
  ],
  controllers: [FirebaseController],
  exports: [FirebaseService],
})
export class FirebaseModule {}
