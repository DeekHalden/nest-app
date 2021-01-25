import { File } from '../../file/entities/file.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @OneToOne(() => File, { onDelete: 'CASCADE' })
  @JoinColumn()
  image: File;

  @ManyToMany(() => File, (file) => file.url, { onDelete: 'CASCADE' })
  @JoinTable()
  images: File[];

  @Column()
  price: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
