import { Injectable } from '@nestjs/common';
import { QuestionService } from '../../src/question/question.service';
import { UserService } from '../../src/user/user.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
  ) {}

  async seed() {
    console.log('Seeding database...');

    const users = [
      {
        email: 'marin@example.com',
        username: 'Marin',
        password:
          '$2b$10$FxY1EZjBPYMM3VKVZWBKpuVY.KNw/EZo4t1fbquQ.SfzR12umk1M.',
      },
      {
        email: 'yulan@example.com',
        username: 'Yulan',
        password:
          '$2b$10$FxY1EZjBPYMM3VKVZWBKpuVY.KNw/EZo4t1fbquQ.SfzR12umk1M.',
      },
    ];

    for (const user of users) {
      const existingUser = await this.userService.findbyEmail(user.email);

      if (!existingUser) {
        await this.userService.create(user);
        console.log(`Utilisateur créé : ${user.username}`);
      } else {
        console.log(`Utilisateur déjà existant : ${user.username}`);
      }
    }

    // Ajout des questions
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
