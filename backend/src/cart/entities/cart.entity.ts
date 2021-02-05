import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

export enum CartItemStatus {
  ORDERED = 'ordered',
  REJECTED = 'rejected',
  REJECTED_BY_CLIENT = 'rejected_by_client',
  PARTIALY_REJECTED = 'partialy_rejected',
  READY_TO_DELIVER = 'ready_to_deliver',
  SENT = 'sent',
  DELIVERED = 'delivered',
}

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cartId, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
