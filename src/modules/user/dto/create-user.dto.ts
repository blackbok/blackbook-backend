import { IsString, IsEmail, IsOptional, IsEnum, IsArray, IsObject, IsDate } from 'class-validator';
import { AuthProvider, Role } from "src/common/utils/enum/Role";


export class AuthMetadataDto {
    @IsString()
    @IsOptional()
    refreshToken?: string; // Optional: Refresh token

    @IsString()
    @IsOptional()
    acessToken?: string; // Optional: Access token

    @IsDate()
    @IsOptional()
    acessTokenExpiresAt?: Date; // Optional: Access token expiry date

    @IsDate()
    @IsOptional()
    refreshTokenExpiresAt?: Date; // Optional: Refresh token expiry date

    @IsEnum(AuthProvider)
    authProvider: string; // Authentication provider

    @IsString()
    providerId?: string; // Optional: Provider ID
}


export class SocialMediaDto {
    @IsString()
    @IsOptional()
    linkedIn?: string; // Optional: LinkedIn profile

    @IsString()
    @IsOptional()
    github?: string; // Optional: GitHub profile

    @IsString()
    @IsOptional()
    twitter?: string; // Optional: Twitter handle

    @IsString()
    @IsOptional()
    instagram?: string; // Optional: Instagram handle

    @IsString()
    @IsOptional()
    facebook?: string; // Optional: Facebook profile

    @IsString()
    @IsOptional()
    website?: string; // Optional: Personal website

    @IsString()
    @IsOptional()
    medium?: string; // Optional: Medium profile

    @IsString()
    @IsOptional()
    behance?: string; // Optional: Behance profile
}

export class AddressDto {
    @IsString()
    @IsOptional()
    city?: string; // Optional: City

    @IsString()
    @IsOptional()
    state?: string; // Optional: State

    @IsString()
    @IsOptional()
    country?: string; // Optional: Country

    @IsString()
    @IsOptional()
    pincode?: string; // Optional: Pincode
}

export class MetadataDto {
    @IsArray()
    @IsOptional()
    favouriteProjects?: string[]; // Optional: List of favorite project IDs

    @IsString()
    @IsOptional()
    bio?: string; // Optional: User bio

    @IsString()
    @IsOptional()
    gender?: string; // Optional: User gender

    @IsString()
    @IsOptional()
    profilePicUrl?: string; // Optional: Profile picture URL

    @IsString()
    @IsOptional()
    phone?: string; // Optional: Phone number

    @IsString()
    @IsOptional()
    college?: string; // Optional: College name

    @IsString()
    @IsOptional()
    degree?: string; // Optional: Degree

    @IsString()
    @IsOptional()
    stream?: string; // Optional: Stream

    @IsObject()
    @IsOptional()
    address?: AddressDto; // Optional: Address details

    @IsArray()
    @IsOptional()
    followers?: string[]; // Optional: List of follower IDs
}



export class CreateUserDto {
    @IsString()
    name: string; // User's full name

    @IsString()
    username: string; // Unique username

    @IsEmail()
    email: string; // User's email address

    @IsString()
    passwordHash: string; // Password hash

    @IsEnum(Role)
    @IsOptional()
    role?: string; // User's role, defaults to Role.USER

    @IsObject()
    authMetadata: AuthMetadataDto; // Authentication metadata

    @IsObject()
    metadata: MetadataDto; // Additional metadata

    @IsObject()
    @IsOptional()
    socialMedia?: SocialMediaDto; // Optional: Social media details
}