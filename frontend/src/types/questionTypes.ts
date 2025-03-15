export type Question = {
  id: string;
  text: string;
  choices: Choice[];
};

export type Choice = {
  id: string;
  text: string;
  isCorrect: boolean;
};
