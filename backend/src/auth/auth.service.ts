import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

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

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
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
}