import { User } from '../../users/intities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  COURIER = 'courier',
  CUSTOMER = 'customer',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
  })
  title: UserRole;

  @ManyToMany((type) => User, (user) => user.roles)
  users: User[];
}
