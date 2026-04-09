import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET ?? (() => { if (process.env.NODE_ENV === 'production') throw new Error('JWT_REFRESH_SECRET must be set in production'); return 'dev_refresh_secret_change_me'; })(),
    });
  }

  validate(payload: { sub: string }) {
    return { id: payload.sub };
  }
}
