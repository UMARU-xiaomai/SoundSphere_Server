import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollaborationRoom } from './entities/room.entity';
import { RoomParticipant } from './entities/participant.entity';

@Injectable()
export class CollaborationService {
  constructor(
    @InjectRepository(CollaborationRoom)
    private roomRepository: Repository<CollaborationRoom>,
    @InjectRepository(RoomParticipant)
    private participantRepository: Repository<RoomParticipant>
  ) {}

  async findAllRooms(page: number = 1, limit: number = 10) {
    const [rooms, total] = await this.roomRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      data: rooms,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.ceil(total / limit)
      }
    };
  }

  async createRoom(createRoomDto: any, userId: string) {
    // 创建房间对象
    const newRoom = this.roomRepository.create({
      ...createRoomDto,
      ownerId: userId
    });
    
    // 保存房间对象并明确指定返回类型为CollaborationRoom
    // TypeORM在某些情况下会返回数组，所以我们使用as确保类型正确
    const savedRoom = await this.roomRepository.save(newRoom) as CollaborationRoom;
    
    // 创建者自动加入房间
    await this.joinRoom(savedRoom.id, userId);
    
    return savedRoom;
  }

  async findOneRoom(id: string) {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['participants']
    });
    if (!room) {
      throw new NotFoundException('房间不存在');
    }
    return room;
  }

  async joinRoom(roomId: string, userId: string) {
    // 检查房间是否存在
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('房间不存在');
    }
    
    // 检查用户是否已经在房间中
    const existingParticipant = await this.participantRepository.findOne({
      where: { roomId, userId }
    });
    
    if (existingParticipant) {
      throw new ConflictException('您已经在该房间中');
    }
    
    // 添加用户到房间
    const participant = this.participantRepository.create({
      roomId,
      userId,
      joinedAt: new Date()
    });
    
    await this.participantRepository.save(participant);
    return { message: '成功加入房间' };
  }

  async leaveRoom(roomId: string, userId: string) {
    // 检查用户是否在房间中
    const participant = await this.participantRepository.findOne({
      where: { roomId, userId }
    });
    
    if (!participant) {
      throw new NotFoundException('您不在该房间中');
    }
    
    // 移除用户
    await this.participantRepository.remove(participant);
    return { message: '已离开房间' };
  }
} 