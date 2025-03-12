import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Choice } from './choice.entity';

@Entity('questions')
export class Question {
  id: string;
  text: string;
  correctAnswerId: string;
  choices: Choice[];
}
