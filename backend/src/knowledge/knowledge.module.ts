import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { Article } from './entities/article.entity';

// 确保上传目录存在
const uploadsDir = path.join(process.cwd(), 'uploads');
const articleCoversDir = path.join(uploadsDir, 'article-covers');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(articleCoversDir)) {
  fs.mkdirSync(articleCoversDir);
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
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
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  exports: [KnowledgeService],
})
export class KnowledgeModule {} 