import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import JwtContentDto from './dtos/jwt-content.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * @param password
   * @returns string
   */
  async hashPassword(password: string) {
    return bcrypt.hash(password, bcrypt.genSaltSync(12));
  }

  /**
   * @param passwordToCheck
   * @param hashedUserPassword
   * @returns boolean
   */
  async checkPassword(passwordToCheck: string, hashedUserPassword: string) {
    return bcrypt.compare(passwordToCheck, hashedUserPassword);
  }

  /**
   * @param jwtContent
   * @returns
   */
  async generateJwt(jwtContent: JwtContentDto) {
    return this.jwtService.sign(jwtContent);
  }

  /**
   * @param jwtCookie
   * @returns
   */
  async getJwtContent(jwtCookie: string): Promise<JwtContentDto> {
    return this.jwtService.verifyAsync<JwtContentDto>(jwtCookie);
  }
}
