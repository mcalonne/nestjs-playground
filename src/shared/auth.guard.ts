import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import JwtContentDto from '../auth/dtos/jwt-content.dto';
import * as Constants from '../auth/auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
    private logger = new Logger(AuthGuard.name);

    constructor(private jwtService: JwtService){}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        try {  
            const jwtCookie = request.cookies[Constants.COOKIE_JWT_NAME];
            const { id: userId } = this.jwtService.verify<JwtContentDto>(jwtCookie);
            this.logger.log(`${userId}`);
            return true;
        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }
}