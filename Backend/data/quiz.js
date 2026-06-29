// In-memory mock data — replace repository internals with Mongoose calls later.
// IDs are plain strings here to mimic Mongo ObjectId strings.

export const Quizzes = [
  {
    _id: 'q1',
    title: 'Limits - Quiz 1',
    course: 'Calculus',
    topic: 'Limits',
    description: 'Basic concepts of limits and limit laws',
    isPublished: true,
    createdBy: 'u1',
    questions: [
      {
        _id: 'q1-1',
        questionText: 'What is lim(x→2) (x + 3)?',
        options: [{ text: '3' }, { text: '5' }, { text: '2' }, { text: '6' }],
        correctOptionIndex: 1,
        explanation: 'Substitute x = 2 directly: 2 + 3 = 5'
      },
      {
        _id: 'q1-2',
        questionText: 'lim(x→0) (sin x / x) equals?',
        options: [{ text: '0' }, { text: '1' }, { text: 'undefined' }, { text: 'infinity' }],
        correctOptionIndex: 1,
        explanation: 'Standard limit identity: sin(x)/x → 1 as x → 0'
      },
      {
        _id: 'q1-3',
        questionText: 'A limit exists at a point if:',
        options: [
          { text: 'The function is defined there' },
          { text: 'Left-hand and right-hand limits are equal' },
          { text: 'The function is continuous everywhere' },
          { text: 'The derivative exists' }
        ],
        correctOptionIndex: 1,
        explanation: 'Limit existence requires left limit = right limit'
      },
      {
        _id: 'q1-4',
        questionText: 'lim(x→3) (x² - 9)/(x - 3) equals?',
        options: [{ text: '0' }, { text: '3' }, { text: '6' }, { text: 'undefined' }],
        correctOptionIndex: 2,
        explanation: 'Factor: (x-3)(x+3)/(x-3) = x+3 → 6 as x→3'
      },
      {
        _id: 'q1-5',
        questionText: 'What does "x → ∞" mean in a limit expression?',
        options: [
          { text: 'x equals infinity' },
          { text: 'x approaches a very large positive number' },
          { text: 'x is undefined' },
          { text: 'x is negative' }
        ],
        correctOptionIndex: 1,
        explanation: 'It describes x growing without bound, not a fixed value'
      },
      {
        _id: 'q1-6',
        questionText: 'lim(x→1) (5) equals?',
        options: [{ text: '0' }, { text: '1' }, { text: '5' }, { text: 'undefined' }],
        correctOptionIndex: 2,
        explanation: 'The limit of a constant function is the constant itself'
      },
      {
        _id: 'q1-7',
        questionText: 'Which is true about one-sided limits?',
        options: [
          { text: 'They only apply to polynomials' },
          { text: 'lim(x→a⁻) approaches from the left' },
          { text: 'They are always equal to two-sided limits' },
          { text: 'They cannot be calculated' }
        ],
        correctOptionIndex: 1,
        explanation: 'The minus sign denotes approach from the left side'
      },
      {
        _id: 'q1-8',
        questionText: 'lim(x→0) (1/x) is:',
        options: [{ text: '0' }, { text: '1' }, { text: 'Does not exist' }, { text: 'Infinity exactly' }],
        correctOptionIndex: 2,
        explanation: 'Left and right limits go to -∞ and +∞ respectively, so it does not exist'
      },
      {
        _id: 'q1-9',
        questionText: 'The Squeeze Theorem is used to:',
        options: [
          { text: 'Find derivatives' },
          { text: 'Evaluate limits bounded between two functions' },
          { text: 'Solve integrals' },
          { text: 'Factor polynomials' }
        ],
        correctOptionIndex: 1,
        explanation: 'It bounds a function between two others with the same limit'
      },
      {
        _id: 'q1-10',
        questionText: 'lim(x→4) √x equals?',
        options: [{ text: '2' }, { text: '4' }, { text: '16' }, { text: 'undefined' }],
        correctOptionIndex: 0,
        explanation: '√4 = 2, and √x is continuous at x = 4'
      }
    ]
  }
];

