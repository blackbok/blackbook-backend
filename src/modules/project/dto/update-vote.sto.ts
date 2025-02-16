import { IsBoolean } from 'class-validator';

export class UpdateVoteDto {
  @IsBoolean()
  upvote: boolean;
}
