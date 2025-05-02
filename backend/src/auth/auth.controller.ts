import { Controller, Post, Body, UseGuards, Request, Get, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CookieJwtAuthGuard } from './guards/cookie-jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功，返回JWT令牌' })
  @ApiResponse({ status: 401, description: '登录失败，用户名或密码错误' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '注册失败，可能是用户名已存在' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '成功返回用户信息' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  
  @ApiOperation({ summary: '获取当前用户信息（通过Cookie）' })
  @ApiResponse({ status: 200, description: '成功返回用户信息' })
  @UseGuards(CookieJwtAuthGuard)
  @Get('profile/cookie')
  getProfileFromCookie(@Request() req) {
    return req.user;
  }
  
  @ApiOperation({ summary: '退出登录' })
  @ApiResponse({ status: 200, description: '退出登录成功' })
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}