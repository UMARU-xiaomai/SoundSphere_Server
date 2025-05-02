import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as fs from 'fs';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async createArticle(createArticleDto: CreateArticleDto, userId: string) {
    const article = this.articleRepository.create({
      ...createArticleDto,
      authorId: userId,
    });

    return this.articleRepository.save(article);
  }

  async uploadCover(id: string, file, userId: string) {
    const article = await this.findOneArticle(id);

    if (article.authorId !== userId) {
      throw new UnauthorizedException('您无权修改此文章');
    }

    if (!file) {
      throw new BadRequestException('封面图片是必须的');
    }

    // 如果已有封面，删除旧文件
    if (article.coverImagePath && fs.existsSync(article.coverImagePath)) {
      fs.unlinkSync(article.coverImagePath);
    }

    article.coverImagePath = file.path;
    return this.articleRepository.save(article);
  }

  async findAllArticles(
    page: number = 1, 
    limit: number = 10,
    search?: string,
    tag?: string
  ) {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');
    
    // 基本连接
    queryBuilder.innerJoinAndSelect('article.author', 'author');
    
    // 条件过滤
    if (search) {
      queryBuilder.andWhere(
        '(article.title LIKE :search OR article.content LIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    if (tag) {
      // 在PostgreSQL中使用JSON包含操作符查询JSON数组
      queryBuilder.andWhere(`article.tags @> :tags`, { tags: JSON.stringify([tag]) });
    }
    
    // 分页
    queryBuilder.skip((page - 1) * limit).take(limit);
    
    // 排序
    queryBuilder.orderBy('article.createdAt', 'DESC');
    
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findArticlesByAuthor(userId: string, page: number = 1, limit: number = 10) {
    const [items, total] = await this.articleRepository.findAndCount({
      where: { authorId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneArticle(id: string) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`ID为${id}的文章不存在`);
    }
    return article;
  }

  async updateArticle(id: string, updateArticleDto: UpdateArticleDto, userId: string) {
    const article = await this.findOneArticle(id);

    if (article.authorId !== userId) {
      throw new UnauthorizedException('您无权修改此文章');
    }

    await this.articleRepository.update(id, updateArticleDto);
    return this.findOneArticle(id);
  }

  async removeArticle(id: string, userId: string) {
    const article = await this.findOneArticle(id);

    if (article.authorId !== userId) {
      throw new UnauthorizedException('您无权删除此文章');
    }

    // 删除相关文件
    if (article.coverImagePath && fs.existsSync(article.coverImagePath)) {
      fs.unlinkSync(article.coverImagePath);
    }

    return this.articleRepository.remove(article);
  }

  async likeArticle(id: string) {
    const article = await this.findOneArticle(id);
    article.likes += 1;
    return this.articleRepository.save(article);
  }

  async viewArticle(id: string) {
    const article = await this.findOneArticle(id);
    article.views += 1;
    return this.articleRepository.save(article);
  }

  async findAllTags() {
    // 从所有文章中提取标签并去重
    const articles = await this.articleRepository.find({
      select: ['tags']
    });
    
    const allTags = [];
    articles.forEach(article => {
      if (article.tags) {
        allTags.push(...article.tags);
      }
    });
    
    // 去重
    const uniqueTags = [...new Set(allTags)];
    
    return { tags: uniqueTags };
  }
} 