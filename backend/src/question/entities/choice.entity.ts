import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('choices')
export class Choice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.choices)
  question: Question;
}
