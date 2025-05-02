import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaborationController } from './collaboration.controller';
import { CollaborationService } from './collaboration.service';
import { CollaborationRoom } from './entities/room.entity';
import { RoomParticipant } from './entities/participant.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollaborationRoom, RoomParticipant]),
  ],
  controllers: [CollaborationController],
  providers: [
    CollaborationService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
  exports: [CollaborationService]
})
export class CollaborationModule {} 