import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, UploadedFiles, Query } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('音乐')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传新音乐' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/music',
        filename: (req, file, cb) => {
          const filename: string = uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(@UploadedFile() file, @Body() createMusicDto: CreateMusicDto, @Request() req) {
    return this.musicService.create(createMusicDto, file, req.user.id);
  }

  @Post('upload-cover/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传音乐封面' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/covers',
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
    return this.musicService.uploadCover(id, file, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取所有公开音乐' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.musicService.findAll(page, limit);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的音乐' })
  findMyMusic(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.musicService.findByUser(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取音乐详情' })
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新音乐信息' })
  update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto, @Request() req) {
    return this.musicService.update(id, updateMusicDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除音乐' })
  remove(@Param('id') id: string, @Request() req) {
    return this.musicService.remove(id, req.user.id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞音乐' })
  like(@Param('id') id: string, @Request() req) {
    return this.musicService.like(id, req.user.id);
  }

  @Post(':id/play')
  @ApiOperation({ summary: '记录播放次数' })
  play(@Param('id') id: string) {
    return this.musicService.play(id);
  }
} 