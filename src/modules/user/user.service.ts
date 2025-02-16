import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/model/user/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserResponse } from './dto/user-response.dto';
import { mapUserToResponse } from 'src/common/utils/user-response.util';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAccessToken(id: string): Promise<User | null> {
    this.logger.log('Fetching access token for user:', id);

    const user = await this.userModel
      .findById(id)
      .select('authMetadata.acessToken')
      .lean()
      .exec();

    if (!user) {
      this.logger.error('User not found');
      return null;
    }
    this.logger.log('Access token:', user.authMetadata.acessToken);
    return user;
  }

  async findAll(): Promise<IUserResponse[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => mapUserToResponse(user));
  }

  async findByEmail(email: string): Promise<IUserResponse | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }
    return mapUserToResponse(user);
  }

  async findById(id: string): Promise<IUserResponse | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return null;
    }
    return mapUserToResponse(user);
  }

  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const createdUser = new this.userModel(createUserDto);
    const user = await createdUser.save();
    if (!user) {
      throw new Error('User not created');
    }

    return mapUserToResponse(user);
  }

  async updateUserData(
    id: Types.ObjectId,
    updateData: UpdateUserDto,
  ): Promise<IUserResponse | null> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();

    if (!user) {
      this.logger.error('User not found');
      return null;
    }

    return mapUserToResponse(user);
  }

  async updateAccessToken(
    id: Types.ObjectId,
    accessToken: string,
  ): Promise<IUserResponse | null> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            'authMetadata.acessToken': accessToken,
          },
        },
        { new: true },
      )
      .exec();

    if (!user) {
      this.logger.error('User not found');
      return null;
    }
    return mapUserToResponse(user);
  }

  async toggleProjectFavorite(
    projectId: string,
    userId: string,
  ): Promise<Types.ObjectId[] | null> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      return null;
    }

    const isFavorite = user.metadata.favouriteProjects?.includes(
      new Types.ObjectId(projectId),
    );

    const updateOperation = isFavorite
      ? { $pull: { 'metadata.favouriteProjects': projectId } }
      : { $addToSet: { 'metadata.favouriteProjects': projectId } };

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateOperation, { new: true })
      .exec();

    if (!updatedUser) {
      return null;
    }

    return updatedUser.metadata.favouriteProjects;
  }

  async fetchFavoriteProjectsIDs(
    userId: string,
  ): Promise<Types.ObjectId[] | null> {
    const userFavouriteProjectIDs = await this.userModel
      .findById(userId)
      .select('metadata.favouriteProjects')
      .exec();

    console.log(userFavouriteProjectIDs);
    if (!userFavouriteProjectIDs) {
      return null;
    }

    return userFavouriteProjectIDs.metadata.favouriteProjects;
  }

  async checkProjectFavoriteStatus({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
  }): Promise<boolean> {
    const userFavouriteProjectIDs = await this.userModel
      .findById(userId)
      .exec();

    console.log(userFavouriteProjectIDs);
    if (!userFavouriteProjectIDs) {
      return false;
    }

    const isFavorite =
      userFavouriteProjectIDs.metadata.favouriteProjects.includes(
        new Types.ObjectId(projectId),
      );

    return isFavorite;
  }
}
