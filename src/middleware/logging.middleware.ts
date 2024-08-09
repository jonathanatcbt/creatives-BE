import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, protocol, originalUrl } = req;
    const completeUrl = `${protocol}://${req.get('host')}${originalUrl}`;
    this.logger.log(`[${method}] ${completeUrl}`);
    next();
  }
}
