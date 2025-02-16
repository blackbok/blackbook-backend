import {
  Controller,
  Get,
  BadRequestException,
  Body,
  Post,
} from '@nestjs/common';
import { DatastoreService } from './datastore.service';
import { DatastoreResponse } from './interface/datastore-response.types';
import { CreateDatastoreDto } from './dto/create-datastore.dto';

@Controller({ path: 'datastore', version: '1' })
export class DatastoreController {
  constructor(private readonly datastoreService: DatastoreService) {}

  @Get()
  async getDatastore(): Promise<DatastoreResponse[]> {
    const datastores = await this.datastoreService.findAllDatastore();
    if (!datastores || datastores.length === 0) {
      throw new BadRequestException('No datastores found.');
    }
    return datastores;
  }

  @Post('create')
  async createDatastore(
    @Body() createDatastoreDto: CreateDatastoreDto,
  ): Promise<DatastoreResponse> {
    return this.datastoreService.createDatastore(createDatastoreDto);
  }
}
