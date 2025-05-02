import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Music {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  filePath: string;

  @Column({ nullable: true })
  coverImagePath: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  bpm: number;

  @Column({ nullable: true })
  key: string;

  @Column({ default: 0 })
  plays: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  creator: User;

  @Column()
  creatorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 