import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ description: '文章标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '文章内容' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '标签' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
} 