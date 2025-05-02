import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RoomParticipant } from './participant.entity';

@Entity()
export class CollaborationRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  ownerId: string;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 10 })
  maxParticipants: number;

  @OneToMany(() => RoomParticipant, participant => participant.room)
  participants: RoomParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 