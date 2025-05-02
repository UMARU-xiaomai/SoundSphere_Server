import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { MarketplaceService } from './marketplace.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductType, LicenseType } from './entities/product.entity';

@ApiTags('市场')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建商品' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const filename: string = uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  createProduct(
    @UploadedFile() file, 
    @Body() createProductDto: CreateProductDto, 
    @Request() req
  ) {
    return this.marketplaceService.createProduct(createProductDto, file, req.user.id);
  }

  @Post('products/:id/preview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传产品预览文件' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/previews',
        filename: (req, file, cb) => {
          const filename: string = uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  uploadPreview(@UploadedFile() file, @Param('id') id: string, @Request() req) {
    return this.marketplaceService.uploadPreview(id, file, req.user.id);
  }

  @Post('products/:id/cover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传产品封面' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/product-covers',
        filename: (req, file, cb) => {
          const filename: string = uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  uploadCover(@UploadedFile() file, @Param('id') id: string, @Request() req) {
    return this.marketplaceService.uploadCover(id, file, req.user.id);
  }

  @Get('products')
  @ApiOperation({ summary: '获取所有产品' })
  findAllProducts(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Query('type') type?: ProductType,
    @Query('license') license?: LicenseType,
    @Query('search') search?: string
  ) {
    return this.marketplaceService.findAllProducts(page, limit, type, license, search);
  }

  @Get('products/mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的产品' })
  findMyProducts(
    @Request() req, 
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10
  ) {
    return this.marketplaceService.findProductsBySeller(req.user.id, page, limit);
  }

  @Get('products/:id')
  @ApiOperation({ summary: '获取产品详情' })
  findOneProduct(@Param('id') id: string) {
    return this.marketplaceService.findOneProduct(id);
  }

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新产品' })
  updateProduct(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto, 
    @Request() req
  ) {
    return this.marketplaceService.updateProduct(id, updateProductDto, req.user.id);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除产品' })
  removeProduct(@Param('id') id: string, @Request() req) {
    return this.marketplaceService.removeProduct(id, req.user.id);
  }

  @Post('orders/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建订单' })
  createOrder(@Param('productId') productId: string, @Request() req) {
    return this.marketplaceService.createOrder(productId, req.user.id);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的订单' })
  findMyOrders(
    @Request() req, 
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10
  ) {
    return this.marketplaceService.findOrdersByBuyer(req.user.id, page, limit);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取订单详情' })
  findOneOrder(@Param('id') id: string, @Request() req) {
    return this.marketplaceService.findOneOrder(id, req.user.id);
  }

  @Post('orders/:id/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '支付订单' })
  payOrder(@Param('id') id: string, @Request() req) {
    // 这里简化处理，实际应该集成支付系统
    return this.marketplaceService.processPayment(id, req.user.id);
  }

  @Get('orders/:id/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '下载已购买的产品' })
  downloadProduct(@Param('id') id: string, @Request() req) {
    return this.marketplaceService.generateDownloadLink(id, req.user.id);
  }

  @Get('sales')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的销售统计' })
  getSalesStats(@Request() req) {
    return this.marketplaceService.getSalesStats(req.user.id);
  }
} 