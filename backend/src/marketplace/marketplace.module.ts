import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';

// 确保上传目录存在
const uploadsDir = path.join(process.cwd(), 'uploads');
const productsDir = path.join(uploadsDir, 'products');
const previewsDir = path.join(uploadsDir, 'previews');
const productCoversDir = path.join(uploadsDir, 'product-covers');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir);
}
if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir);
}
if (!fs.existsSync(productCoversDir)) {
  fs.mkdirSync(productCoversDir);
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Order]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        },
      }),
    }),
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {} 