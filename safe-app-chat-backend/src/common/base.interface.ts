import { AnyBulkWriteOperation, FilterQuery, QueryOptions, Types, UpdateQuery } from "mongoose"

export interface BaseRepositoryInterface<T> {
    create(resource: Partial<T>): Promise<T>
    findById(_id: Types.ObjectId): Promise<T | null>
    findByConditions(filterConditions: FilterQuery<T>): Promise<T | null>
    getByConditions(filterConditions: FilterQuery<T>, options?: QueryOptions): Promise<T[]>
    countByConditions(filterConditions: FilterQuery<T>): Promise<number>
    findAndUpdate(filterConditions: FilterQuery<T>, updateQuery: UpdateQuery<T>, options?: QueryOptions): Promise<T | null>
    bulkWrite(operations: AnyBulkWriteOperation[]): Promise<any>
}