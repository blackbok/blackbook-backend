import { Types } from "mongoose";

export interface IUserResponse {
    id: Types.ObjectId;
    name: string;
    username: string;
    email: string;
    role: string;
    socialMedia?: ISocialMedia;
    metadata?: IMetadata;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISocialMedia {
    linkedIn?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
    medium?: string;
    behance?: string;
}

export interface IMetadata {
    favouriteProjects?: string[]; // Assuming project IDs will be converted to strings
    bio?: string;
    gender?: string;
    profilePicUrl: string;
    phone?: string;
    college?: string;
    degree?: string;
    stream?: string;
    address?: IAddress;
    followers?: string[]; // Assuming follower IDs will be converted to strings
}

export interface IAddress {
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
}
