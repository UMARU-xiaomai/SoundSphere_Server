import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as fs from 'fs';
import { Music } from './entities/music.entity';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>,
  ) {}

  async create(createMusicDto: CreateMusicDto, file, userId: string) {
    if (!file) {
      throw new BadRequestException('音频文件是必须的');
    }

    const music = this.musicRepository.create({
      ...createMusicDto,
      filePath: file.path,
      creatorId: userId,
    });

    return this.musicRepository.save(music);
  }

  async uploadCover(id: string, file, userId: string) {
    const music = await this.findOne(id);

    if (music.creatorId !== userId) {
      throw new UnauthorizedException('您无权修改此音乐');
    }

    if (!file) {
      throw new BadRequestException('封面图片是必须的');
    }

    // 如果已有封面，删除旧文件
    if (music.coverImagePath && fs.existsSync(music.coverImagePath)) {
      fs.unlinkSync(music.coverImagePath);
    }

    music.coverImagePath = file.path;
    return this.musicRepository.save(music);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    let whereCondition: any = { isPublic: true };
    
    // 添加搜索条件
    if (search) {
      whereCondition = {
        ...whereCondition,
        title: Like(`%${search}%`)
      };
    }
    
    const [items, total] = await this.musicRepository.findAndCount({
      where: whereCondition,
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

  async findByUser(userId: string, page: number = 1, limit: number = 10) {
    const [items, total] = await this.musicRepository.findAndCount({
      where: { creatorId: userId },
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

  async findOne(id: string) {
    const music = await this.musicRepository.findOne({ where: { id } });
    if (!music) {
      throw new NotFoundException(`ID为${id}的音乐不存在`);
    }
    return music;
  }

  async update(id: string, updateMusicDto: UpdateMusicDto, userId: string) {
    const music = await this.findOne(id);

    if (music.creatorId !== userId) {
      throw new UnauthorizedException('您无权修改此音乐');
    }

    await this.musicRepository.update(id, updateMusicDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const music = await this.findOne(id);

    if (music.creatorId !== userId) {
      throw new UnauthorizedException('您无权删除此音乐');
    }

    // 删除相关文件
    if (music.filePath && fs.existsSync(music.filePath)) {
      fs.unlinkSync(music.filePath);
    }
    
    if (music.coverImagePath && fs.existsSync(music.coverImagePath)) {
      fs.unlinkSync(music.coverImagePath);
    }

    return this.musicRepository.remove(music);
  }

  async like(id: string, userId: string) {
    const music = await this.findOne(id);
    music.likes += 1;
    return this.musicRepository.save(music);
  }

  async play(id: string) {
    const music = await this.findOne(id);
    music.plays += 1;
    return this.musicRepository.save(music);
  }
  
  // 添加评论方法 - 简化实现，实际应该有评论表
  async addComment(musicId: string, content: string, userId: string) {
    const music = await this.findOne(musicId);
    // 实际应该创建评论记录
    return { 
      id: '评论ID', 
      content,
      musicId,
      userId,
      createdAt: new Date()
    };
  }
  
  // 获取评论列表 - 简化实现，实际应该查询评论表
  async getComments(musicId: string, page: number = 1, limit: number = 10) {
    await this.findOne(musicId); // 确认音乐存在
    
    // 模拟评论数据
    return {
      items: [],
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: 0,
        totalPages: 0
      }
    };
  }
} 