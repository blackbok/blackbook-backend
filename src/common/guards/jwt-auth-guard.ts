import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor() {
    super();
    this.logger.log('JwtAuthGuard initialized');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('Checking JWT authentication');

    try {
      const result = (await super.canActivate(context)) as boolean;
      context.switchToHttp().getRequest();
      return result;
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
