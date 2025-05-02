import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Music } from '../../music/entities/music.entity';

export enum ProductType {
  BEAT = 'beat',
  SAMPLE = 'sample',
  PRESET = 'preset',
  OTHER = 'other',
}

export enum LicenseType {
  BASIC = 'basic',       // 基础授权
  PREMIUM = 'premium',   // 高级授权
  EXCLUSIVE = 'exclusive', // 独家授权
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.BEAT,
  })
  productType: ProductType;

  @Column({
    type: 'enum',
    enum: LicenseType,
    default: LicenseType.BASIC,
  })
  licenseType: LicenseType;

  @Column({ nullable: true })
  coverImagePath: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  previewFilePath: string;

  @Column({ default: 0 })
  sales: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  seller: User;

  @Column()
  sellerId: string;

  @ManyToOne(() => Music, { nullable: true })
  @JoinColumn()
  relatedMusic: Music;

  @Column({ nullable: true })
  relatedMusicId: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 