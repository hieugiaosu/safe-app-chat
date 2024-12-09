import { AnyBulkWriteOperation, ClientSession, FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { IBaseRepository } from "./base.interface";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    private model: Model<T>
    protected constructor(model: Model<T>) {
        this.model = model
    }

    public async create(resource: Partial<T>, session?: ClientSession): Promise<T> {
        const createdResource = new this.model(resource);
        const result = await createdResource.save({ session });
        return result.toObject();
    }

    public async createMany(resources: Partial<T>[], session?: ClientSession): Promise<any> {
        return this.model.insertMany(resources, { session });
    }

    public async findById(_id: Types.ObjectId): Promise<T | null> {
        const result = await this.model.findById(_id).exec();
        if (!result) {
            return null;
        }
        return result.toObject()
    }

    public async findByConditions(filterConditions: FilterQuery<T>): Promise<T | null> {
        const result = await this.model.findOne(filterConditions).exec();
        if (!result) {
            return null;
        }
        return result.toObject()
    }
    
    public async getByConditions(filterConditions: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
        const result = await this.model.find(filterConditions, null, options).exec();
        return result.map((doc) => doc.toObject());
    }
    
    public async countByConditions(filterConditions: FilterQuery<T>): Promise<number> {
        return this.model.countDocuments(filterConditions);
    }

    public async findAndUpdate(filterConditions: FilterQuery<T>, updateQuery: UpdateQuery<T>, options?: QueryOptions): Promise<T | null> {
        const result = await this.model.findOneAndUpdate(filterConditions, updateQuery, options).exec();
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    public async bulkWrite(operations: AnyBulkWriteOperation[]): Promise<any> {
        return this.model.bulkWrite(operations);
    }

    public async update(filterConditions: FilterQuery<T>, updateQuery: UpdateQuery<T>): Promise<unknown> {
        return await this.model.updateMany(filterConditions, updateQuery).exec();
    }
}
