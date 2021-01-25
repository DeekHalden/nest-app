import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @Column({
    name: 'status',
    type: 'enum',
    enum: CartItemStatus,
    default: CartItemStatus.ORDERED,
  })
  status: CartItemStatus;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => CartItem, (product) => product.cart, { cascade: true })
  items: CartItem[];
}
