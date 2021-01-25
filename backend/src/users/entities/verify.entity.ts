import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Verify {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: number;
}