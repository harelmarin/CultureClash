import { Injectable } from '@nestjs/common';
import { QuestionService } from '../../src/question/question.service';

@Injectable()
export class SeedService {
  constructor(private readonly questionService: QuestionService) {}

  async seed() {
    console.log('Seeding database...');

    const questions = [
      {
        text: 'Quelle est la capitale de la France ?',
        choices: [
          { text: 'Paris', isCorrect: true },
          { text: 'Lyon', isCorrect: false },
          { text: 'Marseille', isCorrect: false },
          { text: 'Toulouse', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Quel est le plus grand océan du monde ?',
        choices: [
          { text: 'Océan Atlantique', isCorrect: false },
          { text: 'Océan Pacifique', isCorrect: true },
          { text: 'Océan Indien', isCorrect: false },
          { text: 'Océan Arctique', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: "Quel est l'élément chimique dont le symbole est O ?",
        choices: [
          { text: 'Oxygène', isCorrect: true },
          { text: 'Or', isCorrect: false },
          { text: 'Ozone', isCorrect: false },
          { text: 'Oxyde', isCorrect: false },
        ],
        correctAnswer: '',
      },
    ];

    for (const question of questions) {
      const existingQuestion = await this.questionService.findByText(
        question.text,
      );

      if (!existingQuestion) {
        await this.questionService.create(question);
        console.log(`Question créée : ${question.text}`);
      } else {
        console.log(`Question déjà existante : ${question.text}`);
      }
    }

    console.log('Seeding terminé !');
  }
}
