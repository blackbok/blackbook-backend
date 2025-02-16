import { IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MetadataDto, SocialMediaDto } from './create-user.dto';

export class UpdateUserDto {
  // @ApiPropertyOptional({ description: 'Full name' })
  // @IsString()
  // @IsOptional()
  // name?: string; // Optional: User's full name

  // @ApiPropertyOptional({ description: 'Role' })
  // @IsEnum(Role)
  // @IsOptional()
  // role?: string; // Optional: User's role

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: MetadataDto;

  @ApiPropertyOptional({ description: 'Social media details' })
  @IsObject()
  @IsOptional()
  socialMedia?: SocialMediaDto;
}
