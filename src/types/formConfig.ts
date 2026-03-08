type Amount = {
  value: string;
};

type Category = {
  name: string;
  value: string;
};

export type DifficultyValue = "easy" | "medium" | "hard";

type Difficulty = {
  name: Capitalize<DifficultyValue>;
  value: DifficultyValue;
};

export type FormOptions = {
  amount: Amount[];
  category: Category[];
  difficulty: Difficulty[];
};
