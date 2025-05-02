import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.cookies?.auth_token;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'soundsphere_secret_key'),
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username };
  }
} 