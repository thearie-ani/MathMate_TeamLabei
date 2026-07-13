export const Submission = [
  {
    _id: "sub1",
    quiz: "quiz1",
    student: "stu1",

    answers: [
      {
        questionId: "q1",
        selectedOptionIndex: 1,
        isCorrect: true
      }
    ],

    score: 8,
    totalQuestions: 10,
    percentage: 80,

    createdAt: new Date()
  }
];