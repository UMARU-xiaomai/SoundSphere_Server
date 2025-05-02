import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from './project.entity';

export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}

@Entity()
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, project => project.members, { onDelete: 'CASCADE' })
  @JoinColumn()
  project: Project;

  @Column()
  projectId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.CONTRIBUTOR,
  })
  role: MemberRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 