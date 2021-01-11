import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../roles/entities/role.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ default: false })
  isActive: boolean;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @JoinTable()
  @ManyToMany((type) => Role, (role) => role.users, {
    cascade: true,
    // eager: true,
  })
  roles: Role[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  static async comparePasswords(
    reqPassword: string,
    password: string,
  ): Promise<boolean> {
    const isValid = await bcrypt.compare(reqPassword, password);
    return isValid;
  }
}
