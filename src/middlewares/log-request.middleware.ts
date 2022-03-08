import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogRequestMiddleware implements NestMiddleware {
  private logger = new Logger('Request');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    this.logger.log(`${method} ${url}`); // TODO: make it more relevant
    next();
  }
}
