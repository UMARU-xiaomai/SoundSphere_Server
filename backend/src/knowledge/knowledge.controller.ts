import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { KnowledgeService } from './knowledge.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('知识库')
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post('articles')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建文章' })
  createArticle(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.knowledgeService.createArticle(createArticleDto, req.user.id);
  }

  @Post('articles/:id/cover')
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传文章封面' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/article-covers',
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
    return this.knowledgeService.uploadCover(id, file, req.user.id);
  }

  @Get('articles')
  @Public()
  @ApiOperation({ summary: '获取所有文章' })
  findAllArticles(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('tag') tag?: string
  ) {
    return this.knowledgeService.findAllArticles(page, limit, search, tag);
  }

  @Get('articles/my')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的文章' })
  findMyArticles(
    @Request() req, 
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10
  ) {
    return this.knowledgeService.findArticlesByAuthor(req.user.id, page, limit);
  }

  @Get('articles/:id')
  @Public()
  @ApiOperation({ summary: '获取文章详情' })
  findOneArticle(@Param('id') id: string) {
    return this.knowledgeService.findOneArticle(id);
  }

  @Patch('articles/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新文章' })
  updateArticle(
    @Param('id') id: string, 
    @Body() updateArticleDto: UpdateArticleDto, 
    @Request() req
  ) {
    return this.knowledgeService.updateArticle(id, updateArticleDto, req.user.id);
  }

  @Delete('articles/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除文章' })
  removeArticle(@Param('id') id: string, @Request() req) {
    return this.knowledgeService.removeArticle(id, req.user.id);
  }

  @Post('articles/:id/like')
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞文章' })
  likeArticle(@Param('id') id: string, @Request() req) {
    return this.knowledgeService.likeArticle(id);
  }

  @Post('articles/:id/view')
  @Public()
  @ApiOperation({ summary: '记录文章查看次数' })
  viewArticle(@Param('id') id: string) {
    return this.knowledgeService.viewArticle(id);
  }

  @Get('tags')
  @Public()
  @ApiOperation({ summary: '获取所有标签' })
  findAllTags() {
    return this.knowledgeService.findAllTags();
  }
} 