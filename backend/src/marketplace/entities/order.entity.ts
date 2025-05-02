import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from './product.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  buyer: User;

  @Column()
  buyerId: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn()
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  downloadLink: string;

  @Column({ default: false })
  isDownloaded: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 