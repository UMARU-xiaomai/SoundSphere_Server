import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType, LicenseType } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ description: '产品标题' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: '产品描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '产品价格' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '产品类型', enum: ProductType })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiProperty({ description: '授权类型', enum: LicenseType })
  @IsEnum(LicenseType)
  licenseType: LicenseType;

  @ApiPropertyOptional({ description: '相关音乐ID' })
  @IsUUID()
  @IsOptional()
  relatedMusicId?: string;

  @ApiPropertyOptional({ description: '标签' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
} 