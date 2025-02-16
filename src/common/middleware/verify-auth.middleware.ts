import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class VerifyAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(VerifyAuthMiddleware.name);

  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['access_token'];

    if (!token) {
      this.logger.error('No token provided');
      throw new UnauthorizedException('Token is required');
    }

    this.logger.log('Verifying token');

    try {
      // Verify token with Google UserInfo API
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
      );

      const { email, sub: userId } = response.data;
      if (!email || !userId) {
        this.logger.error('Invalid token response');
        throw new UnauthorizedException('Invalid token response');
      }

      // this.logger.log(`Token is valid for user: ${email}, ID: ${userId}`);

      // Fetch user details from your database
      const user = await this.userService.findByEmail(email);
      if (!user) {
        this.logger.error('User not found');
        throw new UnauthorizedException('User not found');
      }

      // Attach user data to the request object
      req['user'] = user;

      next();
    } catch (error) {
      this.logger.error('Error verifying token:', error.message || error);
      throw new UnauthorizedException('Failed to verify token');
    }
  }
}
