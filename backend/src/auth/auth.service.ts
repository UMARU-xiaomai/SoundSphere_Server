import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, response?: Response) {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    
    // 如果提供了响应对象，则设置cookie
    if (response) {
      const secureCookie = process.env.NODE_ENV === 'production';
      response.cookie('auth_token', token, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天过期
      });
    }
    
    return {
      access_token: token,
      user,
    };
  }
  
  async register(registerDto: RegisterDto) {
    // 检查用户名是否已存在
    const existingUser = await this.userService.findByUsername(registerDto.username);
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await this.userService.findByEmail(registerDto.email);
    if (existingEmail) {
      throw new ConflictException('邮箱已被注册');
    }
    
    try {
      // 密码加密
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(registerDto.password, salt);
      
      // 创建新用户
      const newUser = await this.userService.create({
        ...registerDto,
        password: hashedPassword,
      });
      
      // 移除密码后返回用户信息
      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      throw new BadRequestException('注册失败，请稍后再试');
    }
  }
  
  // 添加退出登录方法
  logout(response: Response) {
    response.clearCookie('auth_token');
    return { message: '退出登录成功' };
  }
}