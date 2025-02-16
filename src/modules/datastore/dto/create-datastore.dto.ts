import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDatastoreDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tagList: string[];

  @IsObject()
  @IsNotEmpty()
  categoryList: Record<string, any>;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  projectTypeList: string[];

  @IsOptional()
  @IsString()
  createdAt?: Date;

  @IsOptional()
  @IsString()
  updatedAt?: Date;
}
