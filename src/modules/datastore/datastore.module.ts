import { Module } from '@nestjs/common';
import { DatastoreController } from './datastore.controller';
import { DatastoreService } from './datastore.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Datastore,
  DatastoreSchema,
} from 'src/model/datastore/data-store.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Datastore.name, schema: DatastoreSchema },
    ]),
  ],
  controllers: [DatastoreController],
  providers: [DatastoreService],
})
export class DatastoreModule {}
