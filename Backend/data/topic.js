const Topics = [
  {
    _id: "topic1",
    course: "course1",
    title: "Limits",
    description: "Understanding limits.",
    content: `
      A limit describes the value a function approaches
      as the input approaches some value.
    `,
    order: 1,
    estimatedMinutes: 15,
    isPublished: true
  },

  {
    _id: "topic2",
    course: "course1",
    title: "Derivatives",
    description: "Introduction to derivatives.",
    content: `
      The derivative measures the rate of change
      of a function.
    `,
    order: 2,
    estimatedMinutes: 20,
    isPublished: true
  },

  {
    _id: "topic3",
    course: "course1",
    title: "Integrals",
    description: "Introduction to integration.",
    content: `
      Integration is the reverse process
      of differentiation.
    `,
    order: 3,
    estimatedMinutes: 25,
    isPublished: true
  },

  {
    _id: "topic4",
    course: "course2",
    title: "Descriptive Statistics",
    description: "Mean, Median, Mode.",
    content: `
      Descriptive statistics summarize data.
    `,
    order: 1,
    estimatedMinutes: 20,
    isPublished: true
  },

  {
    _id: "topic5",
    course: "course2",
    title: "Probability",
    description: "Basics of probability.",
    content: `
      Probability measures uncertainty.
    `,
    order: 2,
    estimatedMinutes: 30,
    isPublished: true
  }
];

export default Topics;