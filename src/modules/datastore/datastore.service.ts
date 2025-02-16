import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Datastore } from 'src/model/datastore/data-store.model';
import { DatastoreResponse } from './interface/datastore-response.types';
import { CreateDatastoreDto } from './dto/create-datastore.dto';

@Injectable()
export class DatastoreService {
  private logger = new Logger('DatastoreService');
  constructor(
    @InjectModel(Datastore.name)
    private readonly datastoreModel: Model<Datastore>,
  ) {}

  async createDatastore(
    createDatastoreDto: CreateDatastoreDto,
  ): Promise<DatastoreResponse> {
    const datastore = new this.datastoreModel(createDatastoreDto);
    await datastore.save();
    return {
      id: datastore.id,
      tagList: datastore.tagList,
      categoryList: datastore.categoryList,
      projectTypeList: datastore.projectTypeList,
      createdAt: datastore.createdAt,
      updatedAt: datastore.updatedAt,
    };
  }

  async findAllDatastore(): Promise<DatastoreResponse[]> {
    const datastores = await this.datastoreModel.find().exec();
    return datastores.map((datastore) => ({
      id: datastore.id,
      tagList: datastore.tagList,
      categoryList: datastore.categoryList,
      projectTypeList: datastore.projectTypeList,
      createdAt: datastore.createdAt,
      updatedAt: datastore.updatedAt,
    }));
  }
}
