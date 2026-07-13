import { useState } from 'react';

/**
 * Hook to manage quiz and practice session state.
 * @param {Array} questions - The list of questions for the quiz.
 */
export function useQuiz(questions = []) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: answerId }
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const submitAnswer = (questionId, answerId, isCorrect) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setScore(0);
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
    selectedAnswers,
    isFinished,
    score,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    resetQuiz
  };
}
