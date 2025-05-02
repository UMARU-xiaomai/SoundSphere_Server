import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CollaborationService } from './collaboration.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('协作')
@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Get('rooms')
  @Public()
  @ApiOperation({ summary: '获取所有协作房间' })
  findAllRooms(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10
  ) {
    return this.collaborationService.findAllRooms(page, limit);
  }

  @Post('rooms')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建协作房间' })
  createRoom(@Body() createRoomDto: any, @Request() req) {
    return this.collaborationService.createRoom(createRoomDto, req.user.id);
  }

  @Get('rooms/:id')
  @Public()
  @ApiOperation({ summary: '获取房间详情' })
  findOneRoom(@Param('id') id: string) {
    return this.collaborationService.findOneRoom(id);
  }

  @Post('rooms/:id/join')
  @ApiBearerAuth()
  @ApiOperation({ summary: '加入房间' })
  joinRoom(@Param('id') id: string, @Request() req) {
    return this.collaborationService.joinRoom(id, req.user.id);
  }

  @Post('rooms/:id/leave')
  @ApiBearerAuth()
  @ApiOperation({ summary: '离开房间' })
  leaveRoom(@Param('id') id: string, @Request() req) {
    return this.collaborationService.leaveRoom(id, req.user.id);
  }
} 