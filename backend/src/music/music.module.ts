import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { Music } from './entities/music.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// 确保上传目录存在
const uploadsDir = path.join(process.cwd(), 'uploads');
const musicDir = path.join(uploadsDir, 'music');
const coversDir = path.join(uploadsDir, 'covers');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir);
}
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir);
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Music]),
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
  controllers: [MusicController],
  providers: [
    MusicService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
  exports: [MusicService],
})
export class MusicModule {} 