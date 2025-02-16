import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  IsDate,
} from 'class-validator';
import { AuthProvider, Role } from 'src/common/utils/enum/Role';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthMetadataDto {
  @ApiPropertyOptional({ description: 'Refresh token' })
  @IsString()
  @IsOptional()
  refreshToken?: string; // Optional: Refresh token

  @ApiPropertyOptional({ description: 'Access token' })
  @IsString()
  @IsOptional()
  acessToken?: string; // Optional: Access token

  @ApiPropertyOptional({ description: 'Access token expiry date' })
  @IsDate()
  @IsOptional()
  acessTokenExpiresAt?: Date; // Optional: Access token expiry date

  @ApiPropertyOptional({ description: 'Refresh token expiry date' })
  @IsDate()
  @IsOptional()
  refreshTokenExpiresAt?: Date; // Optional: Refresh token expiry date

  @ApiProperty({ description: 'Authentication provider' })
  @IsEnum(AuthProvider)
  authProvider: string; // Authentication provider

  @ApiPropertyOptional({ description: 'Provider ID' })
  @IsString()
  providerId?: string; // Optional: Provider ID
}

export class SocialMediaDto {
  @ApiPropertyOptional({ description: 'LinkedIn profile' })
  @IsString()
  @IsOptional()
  linkedIn?: string; // Optional: LinkedIn profile

  @ApiPropertyOptional({ description: 'GitHub profile' })
  @IsString()
  @IsOptional()
  github?: string; // Optional: GitHub profile

  @ApiPropertyOptional({ description: 'Twitter handle' })
  @IsString()
  @IsOptional()
  twitter?: string; // Optional: Twitter handle

  @ApiPropertyOptional({ description: 'Instagram handle' })
  @IsString()
  @IsOptional()
  instagram?: string; // Optional: Instagram handle

  @ApiPropertyOptional({ description: 'Facebook profile' })
  @IsString()
  @IsOptional()
  facebook?: string; // Optional: Facebook profile

  @ApiPropertyOptional({ description: 'Personal website' })
  @IsString()
  @IsOptional()
  website?: string; // Optional: Personal website

  @ApiPropertyOptional({ description: 'Medium profile' })
  @IsString()
  @IsOptional()
  medium?: string; // Optional: Medium profile

  @ApiPropertyOptional({ description: 'Behance profile' })
  @IsString()
  @IsOptional()
  behance?: string; // Optional: Behance profile
}

export class AddressDto {
  @ApiPropertyOptional({ description: 'City' })
  @IsString()
  @IsOptional()
  city?: string; // Optional: City

  @ApiPropertyOptional({ description: 'State' })
  @IsString()
  @IsOptional()
  state?: string; // Optional: State

  @ApiPropertyOptional({ description: 'Country' })
  @IsString()
  @IsOptional()
  country?: string; // Optional: Country

  @ApiPropertyOptional({ description: 'Pincode' })
  @IsString()
  @IsOptional()
  pincode?: string; // Optional: Pincode
}

export class MetadataDto {
  @ApiPropertyOptional({ description: 'Favorite projects' })
  @IsArray()
  @IsOptional()
  favouriteProjects?: string[]; // Optional: List of favorite project IDs

  @ApiPropertyOptional({ description: 'Bio' })
  @IsString()
  @IsOptional()
  bio?: string; // Optional: User bio

  @ApiPropertyOptional({ description: 'Gender' })
  @IsString()
  @IsOptional()
  gender?: string; // Optional: User gender

  @ApiPropertyOptional({ description: 'Profiler picture url' })
  @IsString()
  @IsOptional()
  profilePicUrl?: string; // Optional: Profile picture URL

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string; // Optional: Phone number

  @ApiPropertyOptional({ description: 'College name' })
  @IsString()
  @IsOptional()
  college?: string; // Optional: College name

  @ApiPropertyOptional({ description: 'Degree' })
  @IsString()
  @IsOptional()
  degree?: string; // Optional: Degree

  @ApiPropertyOptional({ description: 'Stream' })
  @IsString()
  @IsOptional()
  stream?: string; // Optional: Stream

  @ApiPropertyOptional({ description: 'Address details' })
  @IsObject()
  @IsOptional()
  address?: AddressDto; // Optional: Address details

  @ApiPropertyOptional({ description: 'Followers' })
  @IsArray()
  @IsOptional()
  followers?: string[]; // Optional: List of follower IDs
}

export class CreateUserDto {
  @ApiProperty({ description: 'Full name' })
  @IsString()
  name: string; // User's full name

  @ApiProperty({ description: 'Unique username' })
  @IsString()
  username: string; // Unique username

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string; // User's email address

  @ApiProperty({ description: 'Password hash' })
  @IsString()
  passwordHash: string; // Password hash

  @ApiPropertyOptional({ description: 'Role' })
  @IsEnum(Role)
  @IsOptional()
  role?: string; // User's role, defaults to Role.USER

  @ApiPropertyOptional({ description: 'Authentication metadata' })
  @IsObject()
  authMetadata: AuthMetadataDto; // Authentication metadata

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  metadata: MetadataDto; // Additional metadata

  @ApiPropertyOptional({ description: 'Social media details' })
  @IsObject()
  @IsOptional()
  socialMedia?: SocialMediaDto; // Optional: Social media details
}
