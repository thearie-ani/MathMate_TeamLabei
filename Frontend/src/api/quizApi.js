import { delay, quizzes, getQuizScore } from "./mockApi";

export const getQuizzes = async () => delay({ data: quizzes });

export const getQuizById = async (id) => {
  const quiz = quizzes.find((item) => String(item.id) === String(id)) ?? null;
  return delay({ data: quiz });
};

export const submitQuiz = async (id, answers) => {
  const quiz = quizzes.find((item) => String(item.id) === String(id));
  const score = quiz ? getQuizScore(quiz, answers) : 0;
  return delay({ data: { score, total: quiz?.questions?.length ?? 0 } });
};
