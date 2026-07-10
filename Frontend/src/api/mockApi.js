const AUTH_KEY = "mathmate.mock.auth";
const PROFILE_KEY = "mathmate.mock.profile";

export const delay = (value, ms = 120) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const quizzes = [
  {
    id: 1,
    title: "Limits & Continuity",
    questions: [
      { text: "What is the limit of x as x approaches 2?", options: ["2", "4", "0", "Does not exist"], correctAnswer: 0 },
      { text: "Which condition best supports continuity?", options: ["No jump", "No slope", "No intercept", "No domain"], correctAnswer: 0 },
      { text: "A function is continuous if the limit equals the", options: ["Derivative", "Function value", "Integral", "Average value"], correctAnswer: 1 },
    ],
  },
  {
    id: 2,
    title: "Derivatives",
    questions: [
      { text: "What is d/dx of x^5?", options: ["x^4", "5x^4", "5x^5", "x^6"], correctAnswer: 1 },
      { text: "What is d/dx of a constant?", options: ["1", "The constant", "0", "Undefined"], correctAnswer: 2 },
      { text: "Power rule for x^n becomes", options: ["nx^(n-1)", "x^(n+1)", "n/x", "x/n"], correctAnswer: 0 },
    ],
  },
  {
    id: 3,
    title: "Applications",
    questions: [
      { text: "What does a derivative represent?", options: ["Area", "Rate of change", "Sum", "Product"], correctAnswer: 1 },
      { text: "What is the slope of a tangent line?", options: ["Derivative", "Integral", "Average", "Limit only"], correctAnswer: 0 },
      { text: "Optimization problems usually look for", options: ["Maximum or minimum", "Only zero", "Only average", "Only constants"], correctAnswer: 0 },
    ],
  },
  {
    id: 4,
    title: "Integrals",
    questions: [
      { text: "The integral is often used to find", options: ["Slope", "Area", "Derivative", "Point"], correctAnswer: 1 },
      { text: "The antiderivative of x is", options: ["x^2/2 + C", "1/x + C", "2x + C", "x + C"], correctAnswer: 0 },
      { text: "The constant of integration is", options: ["C", "x", "dx", "f(x)"], correctAnswer: 0 },
    ],
  },
  {
    id: 5,
    title: "Applications II",
    questions: [
      { text: "Related rates are based on", options: ["Derivatives", "Matrices", "Fractions", "Logs"], correctAnswer: 0 },
      { text: "A tangent line touches a curve at", options: ["One point locally", "Many points", "No points", "Infinity"], correctAnswer: 0 },
      { text: "Maximum velocity comes from", options: ["Steepest slope", "Zero slope", "Constant slope", "No slope"], correctAnswer: 0 },
    ],
  },
  {
    id: 6,
    title: "Derivatives II",
    questions: [
      { text: "Product rule is used when", options: ["Adding functions", "Multiplying functions", "Subtracting constants", "Dividing integers"], correctAnswer: 1 },
      { text: "Chain rule is used for", options: ["Nested functions", "Linear functions only", "Constants only", "Polynomials only"], correctAnswer: 0 },
      { text: "Implicit differentiation handles", options: ["Explicit x only", "x and y mixed", "Only constants", "Only graphs"], correctAnswer: 1 },
    ],
  },
];

export const lessons = [
  {
    id: 1,
    title: "Algebra",
    level: "Grade 11",
    progress: 65,
    lessons: 24,
    modules: 8,
    summary: "Equations, functions, and algebraic patterns.",
  },
  {
    id: 2,
    title: "Calculus",
    level: "Grade 11",
    progress: 12,
    lessons: 18,
    modules: 5,
    summary: "Limits, derivatives, and integrals.",
  },
  {
    id: 3,
    title: "Geometry",
    level: "Grade 11",
    progress: 40,
    lessons: 32,
    modules: 10,
    summary: "Shapes, proofs, and spatial reasoning.",
  },
  {
    id: 4,
    title: "Functions",
    level: "Grade 11",
    progress: 88,
    lessons: 15,
    modules: 4,
    summary: "Transformations, inverses, and graphs.",
  },
];

export const conversations = [
  {
    id: "intro",
    title: "Derivative review",
    lastMessage: "Let's practice the power rule next.",
  },
  {
    id: "limits",
    title: "Limits check-in",
    lastMessage: "Continuity means no jump at the point.",
  },
];

const defaultProfile = {
  name: "Student",
  email: "student@example.com",
  role: "student",
  xp: 2450,
  level: 5,
  achievements: [
    { name: "First Quiz", icon: "🏁", unlocked: true, description: "Completed the first quiz." },
    { name: "Daily Streak", icon: "🔥", unlocked: true, description: "Practiced two days in a row." },
    { name: "Focus Mode", icon: "🎯", unlocked: false, description: "Stayed focused for 30 minutes." },
  ],
};

export const getStoredAuth = () => {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setStoredAuth = (auth) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  localStorage.setItem(PROFILE_KEY, JSON.stringify(auth.user ?? defaultProfile));
  return auth;
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getStoredProfile = () => {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : defaultProfile;
};

export const setStoredProfile = (data) => {
  const updated = { ...getStoredProfile(), ...data };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
};

export const buildTutorReply = (message) => {
  const normalized = message.toLowerCase();

  if (normalized.includes("derivative") || normalized.includes("power rule")) {
    return "Use the power rule: d/dx(x^n) = n*x^(n-1). Try x^5 to get 5x^4.";
  }

  if (normalized.includes("limit") || normalized.includes("continuity")) {
    return "A limit describes what a function approaches. For continuity, the limit should match the function value.";
  }

  return `Mock tutor response: ${message}`;
};

export const getQuizScore = (quiz, answers = []) =>
  quiz.questions.reduce((score, question, index) => {
    return answers[index] === question.correctAnswer ? score + 1 : score;
  }, 0);