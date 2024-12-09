import { AnyBulkWriteOperation, ClientSession, FilterQuery, QueryOptions, Types, UpdateQuery } from "mongoose"

export interface IBaseRepository<T> {
    create(resource: Partial<T>, session?: ClientSession): Promise<T>
    createMany(resources: Partial<T>[], session?: ClientSession): Promise<any>
    findById(_id: Types.ObjectId): Promise<T | null>
    findByConditions(filterConditions: FilterQuery<T>): Promise<T | null>
    getByConditions(filterConditions: FilterQuery<T>, options?: QueryOptions): Promise<T[]>
    countByConditions(filterConditions: FilterQuery<T>): Promise<number>
    findAndUpdate(filterConditions: FilterQuery<T>, updateQuery: UpdateQuery<T>, options?: QueryOptions): Promise<T | null>
    bulkWrite(operations: AnyBulkWriteOperation[]): Promise<any>
    update(filterConditions: FilterQuery<T>, updateQuery: UpdateQuery<T>): Promise<unknown>
}