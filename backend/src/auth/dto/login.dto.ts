import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'user123' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}