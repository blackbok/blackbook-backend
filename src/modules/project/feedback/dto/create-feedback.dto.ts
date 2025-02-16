import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectFeedbackDto {
  @ApiProperty({
    example: '660d1f2e5f5b2c6d88f1b22a',
    description: 'The unique identifier of the project receiving feedback.',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    example: '661a7b3c8e4f1c2d33e7d6a1',
    description: 'The unique identifier of the user providing feedback.',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the person providing feedback.',
  })
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address of the feedback author.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'This project is well-structured and easy to understand.',
    description: 'The content of the feedback.',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
