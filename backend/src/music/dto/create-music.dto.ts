import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMusicDto {
  @ApiProperty({ description: '音乐标题' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: '音乐描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '音乐类型' })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiPropertyOptional({ description: '音乐BPM' })
  @IsNumber()
  @IsOptional()
  bpm?: number;

  @ApiPropertyOptional({ description: '音乐调性' })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiPropertyOptional({ description: '是否公开' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: '标签' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
} 