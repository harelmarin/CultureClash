import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('choices')
export class Choice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'boolean' })
  isCorrect: boolean;
}
