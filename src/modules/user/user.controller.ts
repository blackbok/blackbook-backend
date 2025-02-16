import {
  Controller,
  Post,
  Get,
  Body,
  Put,
  Param,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserResponse } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
@ApiTags('Users')
@Controller({ path: 'user', version: '1' })
export class UserController {
  private logger = new Logger('UserController');
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get all users',
    description: 'Fetches a list of all users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users successfully retrieved',
  })
  @Get()
  async getUsers(): Promise<IUserResponse[]> {
    return await this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user with provided details',
  })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiBody({ type: CreateUserDto })
  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    if (!createUserDto) {
      throw new Error('Invalid request body');
    }
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Update user data',
    description: 'Updates user details based on user ID',
  })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User ID',
    type: String,
  })
  @Put('update/:userId')
  async updateUser(
    @Param('userId') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse | null> {
    console.log('id', id);
    console.log('updateUserDto', updateUserDto);
    const objectId = new Types.ObjectId(id);
    return await this.userService.updateUserData(objectId, updateUserDto);
  }
}
