import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Choice } from './choice.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'uuid' })
  correctAnswer: string;

  @OneToMany(() => Choice, (choice) => choice.question, { cascade: true })
  choices: Choice[];
}
