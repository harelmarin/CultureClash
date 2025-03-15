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
      {
        text: 'Combien de continents y a-t-il sur Terre ?',
        choices: [
          { text: '5', isCorrect: false },
          { text: '6', isCorrect: false },
          { text: '7', isCorrect: true },
          { text: '8', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: "Quel est l'animal terrestre le plus grand ?",
        choices: [
          { text: 'Éléphant', isCorrect: true },
          { text: 'Girafe', isCorrect: false },
          { text: 'Sauterelle', isCorrect: false },
          { text: 'Rhinocéros', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: "En quelle année l'homme a-t-il marché sur la Lune pour la première fois ?",
        choices: [
          { text: '1969', isCorrect: true },
          { text: '1972', isCorrect: false },
          { text: '1965', isCorrect: false },
          { text: '1980', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Qui a écrit "Les Misérables" ?',
        choices: [
          { text: 'Victor Hugo', isCorrect: true },
          { text: 'Emile Zola', isCorrect: false },
          { text: 'Honoré de Balzac', isCorrect: false },
          { text: 'Molière', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Quelle est la monnaie du Japon ?',
        choices: [
          { text: 'Yen', isCorrect: true },
          { text: 'Won', isCorrect: false },
          { text: 'Peso', isCorrect: false },
          { text: 'Ringgit', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Quel est le plus grand pays du monde ?',
        choices: [
          { text: 'Canada', isCorrect: false },
          { text: 'Russie', isCorrect: true },
          { text: 'États-Unis', isCorrect: false },
          { text: 'Chine', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Quel est le nom de la NASA ?',
        choices: [
          {
            text: 'National Aeronautics and Space Administration',
            isCorrect: true,
          },
          { text: 'National Association for Space Aviation', isCorrect: false },
          { text: 'North American Space Agency', isCorrect: false },
          { text: 'National Air and Space Agency', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Qui est le créateur de Facebook ?',
        choices: [
          { text: 'Mark Zuckerberg', isCorrect: true },
          { text: 'Bill Gates', isCorrect: false },
          { text: 'Steve Jobs', isCorrect: false },
          { text: 'Elon Musk', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Quel est le plus petit pays du monde ?',
        choices: [
          { text: 'Monaco', isCorrect: false },
          { text: 'Vatican', isCorrect: true },
          { text: 'Nauru', isCorrect: false },
          { text: 'Saint-Marin', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Quel est le plus long fleuve du monde ?',
        choices: [
          { text: 'Nil', isCorrect: true },
          { text: 'Amazonie', isCorrect: false },
          { text: 'Yangzi Jiang', isCorrect: false },
          { text: 'Mississippi', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: "Combien de pays composent l'Union européenne ?",
        choices: [
          { text: '27', isCorrect: true },
          { text: '28', isCorrect: false },
          { text: '26', isCorrect: false },
          { text: '30', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: "Quel est l'invention attribuée à Thomas Edison ?",
        choices: [
          { text: 'Ampoule électrique', isCorrect: true },
          { text: 'Téléphone', isCorrect: false },
          { text: 'Ordinateur', isCorrect: false },
          { text: 'Machine à vapeur', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'En quelle année la Première Guerre mondiale a-t-elle commencé ?',
        choices: [
          { text: '1912', isCorrect: false },
          { text: '1914', isCorrect: true },
          { text: '1916', isCorrect: false },
          { text: '1939', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Dans quel pays se trouve le Mont Everest ?',
        choices: [
          { text: 'Népal', isCorrect: true },
          { text: 'Inde', isCorrect: false },
          { text: 'Chine', isCorrect: false },
          { text: 'Bhoutan', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Quel est le sport le plus pratiqué dans le monde ?',
        choices: [
          { text: 'Football', isCorrect: true },
          { text: 'Basketball', isCorrect: false },
          { text: 'Tennis', isCorrect: false },
          { text: 'Cricket', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: "Quel est l'élément chimique dont le symbole est Fe ?",
        choices: [
          { text: 'Fer', isCorrect: true },
          { text: 'Fluor', isCorrect: false },
          { text: 'Flerovium', isCorrect: false },
          { text: 'Francium', isCorrect: false },
        ],
        correctAnswer: '',
      },
      {
        text: 'Qui a peint la Joconde ?',
        choices: [
          { text: 'Léonard de Vinci', isCorrect: true },
          { text: 'Michel-Ange', isCorrect: false },
          { text: 'Vincent van Gogh', isCorrect: false },
          { text: 'Claude Monet', isCorrect: false },
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
