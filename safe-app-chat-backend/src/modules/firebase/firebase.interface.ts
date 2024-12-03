export interface IFirebaseRealtimeDbRepository {
    set(path: string, value: unknown, callback?: (error: Error | null) => void): Promise<void>;
    get(path: string): Promise<unknown>;
    update(path: string, value: object, callback?: (error: Error | null) => void): Promise<void>;
    push(path: string, value: unknown): Promise<void>;
    transaction(path: string, transactionUpdate: (currentData: unknown) => unknown): Promise<void>;
}