import { IUserResponse } from 'src/modules/user/dto/user-response.dto';
import { UserDocument } from 'src/model/user/user.model';

export function mapUserToResponse(user: UserDocument): IUserResponse {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,

    socialMedia: user.socialMedia
      ? {
          linkedIn: user.socialMedia.linkedIn,
          github: user.socialMedia.github,
          twitter: user.socialMedia.twitter,
          instagram: user.socialMedia.instagram,
          facebook: user.socialMedia.facebook,
          website: user.socialMedia.website,
          medium: user.socialMedia.medium,
          behance: user.socialMedia.behance,
        }
      : undefined,
    metadata: user.metadata
      ? {
          favouriteProjects: user.metadata.favouriteProjects?.map((id) =>
            id.toString(),
          ),
          bio: user.metadata.bio,
          gender: user.metadata.gender,
          profilePicUrl: user.metadata.profilePicUrl,
          phone: user.metadata.phone,
          college: user.metadata.college,
          degree: user.metadata.degree,
          stream: user.metadata.stream,
          address: user.metadata.address
            ? {
                city: user.metadata.address.city,
                state: user.metadata.address.state,
                country: user.metadata.address.country,
                pincode: user.metadata.address.pincode,
              }
            : undefined,
          followers: user.metadata.followers?.map((id) => id.toString()),
        }
      : undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
