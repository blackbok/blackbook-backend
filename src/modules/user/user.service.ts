import { HttpException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "src/model/user/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { IUserResponse } from "src/interfaces/Iuser.response.interface";
import { mapUserToResponse } from "src/common/utils/user-response.util";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
        const createdUser = new this.userModel(createUserDto);
        this.logger.log('Creating user:', createdUser);
        const user = await createdUser.save();
        if (!user) {
            throw new Error('User not created');
        }

        return mapUserToResponse(user);
    }

    async getAccessToken(id: string): Promise<User | null> {
        this.logger.log('Fetching access token for user:', id);

        const user = await this.userModel
            .findById(id)
            .select('authMetadata.acessToken').lean().exec();

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

    async updateAccessToken(id: Types.ObjectId, accessToken: string): Promise<IUserResponse | null> {
        this.logger.log('Updating access token for user:', id);
        this.logger.log('New access token:', accessToken);

        // Ensure that the accessToken is updated correctly in the metadata field
        const user = await this.userModel.findByIdAndUpdate(
            id,
            {
                // Update the accessToken in both authMetadata and metadata fields
                $set: {
                    'authMetadata.acessToken': accessToken,
                },
            },
            { new: true }
        ).exec();


        if (!user) {
            this.logger.error('User not found');
            return null;
        }

        // Ensure that you are extracting the correct values from the updated user
        return mapUserToResponse(user);
    }
}