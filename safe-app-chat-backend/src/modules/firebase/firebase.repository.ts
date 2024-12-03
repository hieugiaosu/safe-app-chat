import { Inject, Injectable } from "@nestjs/common";
import { app, database } from 'firebase-admin';
import { IFirebaseRealtimeDbRepository } from "./firebase.interface";

@Injectable()
export class FirebaseRealtimeDbRepository implements IFirebaseRealtimeDbRepository {
    private realtimeDb: database.Database;
    constructor(
        @Inject("FIREBASE_REALTIME_DB_ADMIN_APP") private readonly firebaseAdminApp: app.App
    ){
        this.realtimeDb = this.firebaseAdminApp.database();
    }

    async set(path: string, value: unknown, callback?: (error: Error | null) => void): Promise<void> {
        this.realtimeDb.ref(path).set(value, callback);
    }

    async get(path: string): Promise<unknown> {
        return this.realtimeDb.ref(path).once('value').then(snapshot => snapshot.val());
    }

    async update(path: string, value: object, callback?: (error: Error | null) => void): Promise<void> {
        this.realtimeDb.ref(path).update(value, callback);
    }
    
    async push(path: string, value: unknown): Promise<void> {
        this.realtimeDb.ref(path).push(value);
    }

    async transaction(path: string, transactionUpdate: (currentData: unknown) => unknown): Promise<void> {
        this.realtimeDb.ref(path).transaction(transactionUpdate);
    }
}