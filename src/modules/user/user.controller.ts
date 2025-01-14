import { Controller, Post, Get, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { IUserResponse } from "./dto/user-response.dto";

@Controller({ path: 'user', version: '1' })
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<IUserResponse> {
        if (!createUserDto) {
            throw new Error("Invalid request body");
        }
        return await this.userService.create(createUserDto);
    }

    @Get()
    async getUsers(): Promise<IUserResponse[]> {
        return await this.userService.findAll();
    }
}