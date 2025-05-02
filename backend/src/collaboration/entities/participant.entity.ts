import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CollaborationRoom } from './room.entity';

@Entity()
export class RoomParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  lastActiveAt: Date;

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(() => CollaborationRoom, room => room.participants)
  @JoinColumn({ name: 'roomId' })
  room: CollaborationRoom;
} 