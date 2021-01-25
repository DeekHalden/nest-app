import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../roles/entities/role.entity';
import { Exclude } from 'class-transformer';

export const comparePasswords = async (reqPassword: string, password: string) =>
  await bcrypt.compare(reqPassword, password);

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: false })
  isActive: boolean;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @JoinTable()
  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  static async hashPassword(password: string) {
    return await hashPassword(password);
  }

  @BeforeInsert()
  async hash() {
    this.password = await User.hashPassword(this.password);
  }
}
