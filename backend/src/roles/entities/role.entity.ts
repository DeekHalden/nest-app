import { User } from '../../users/entities/user.entity';
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
    name: 'title',
    type: 'enum',
    enum: UserRole,
  })
  title!: UserRole;

  @ManyToMany((type) => User, (user) => user.roles)
  users?: User[];
}
