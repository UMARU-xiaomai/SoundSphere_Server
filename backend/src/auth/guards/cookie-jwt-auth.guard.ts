import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CookieJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.auth_token;
    
    if (token) {
      // 从cookie中提取token并设置到请求头中
      request.headers.authorization = `Bearer ${token}`;
    }
    
    return super.canActivate(context);
  }
} 