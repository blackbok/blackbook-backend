import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/model/user/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { IUserResponse } from "./dto/user-response.dto";

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

        const userData: IUserResponse = {
            id: user.id as string,
            metadata: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: {
                    city: user.metadata.address.city,
                    state: user.metadata.address.state,
                    country: user.metadata.address.country,
                    pincode: user.metadata.address.pincode,
                },
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
        return userData;
    }

    async findAll(): Promise<IUserResponse[]> {
        const users = await this.userModel.find().exec();
        return users.map(user => ({
            id: user.id as string,
            metadata: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: {
                    city: user.metadata.address.city,
                    state: user.metadata.address.state,
                    country: user.metadata.address.country,
                    pincode: user.metadata.address.pincode,
                },
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        }));
    }

    async findByEmail(email: string): Promise<IUserResponse | null> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            return null;
        }
        const userData: IUserResponse = {
            id: user.id as string,
            metadata: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: {
                    city: user.metadata.address.city,
                    state: user.metadata.address.state,
                    country: user.metadata.address.country,
                    pincode: user.metadata.address.pincode,
                },
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
        return userData;
    }
}