import { Inject, Injectable } from '@nestjs/common';
import { IFirebaseRealtimeDbRepository } from './firebase.interface';

@Injectable()
export class FirebaseService {
    constructor(
        @Inject('IFirebaseRealtimeDbRepository') 
        private readonly firebaseRealtimeDbRepository: IFirebaseRealtimeDbRepository
    ) {}

    async set(path: string, value: unknown) {
        return this.firebaseRealtimeDbRepository.set(path, value);
    }

    async get(path: string) {
        return this.firebaseRealtimeDbRepository.get(path);
    }
}
