import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ResetPassword {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: number;
}
