import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return {
      userId:
        payload[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] ||
        payload.userId ||
        payload.sub,
      username:
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        payload.username ||
        payload.name,
      ...payload,
    };
  }
}
