import Submission from "../models/Submission.js";

// submission
export const create = async (submissionData) => {
  return Submission.create(submissionData);
};

export const findById = async (id) => {
  return Submission.findById(id)
    .populate("quiz", "title course topic")
    .populate("student", "name email")
    .lean();
};

export const findByQuizAndStudent = async (quizId, studentId) => {
  return Submission.findOne({
    quiz: quizId,
    student: studentId,
  }).lean();
};

export const findByStudentId = async (
  studentId,
  { skip = 0, limit = 20 } = {}
) => {
  return Submission.find({
    student: studentId,
  })
    .populate("quiz", "title course topic")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const countByStudentId = async (studentId) => {
  return Submission.countDocuments({
    student: studentId,
  });
};

export const findByQuizId = async (quizId) => {
  return Submission.find({
    quiz: quizId,
  })
    .populate("student", "username email")
    .sort({ score: -1 })
    .lean();
};

export const countAttempts = async (studentId, quizId) => {
  return Submission.countDocuments({
    student: studentId,
    quiz: quizId,
  });
};

export const updateById = async (id, updateData) => {
  return Submission.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const retakeSubmission = async ({
  submissionId,
  answers,
  score,
  pointsEarned,
  totalPoints,
  passed,
  attemptNumber,
}) => {
  return Submission.findByIdAndUpdate(
    submissionId,
    {
      answers,
      score,
      pointsEarned,
      totalPoints,
      passed,
      attemptNumber,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteById = async (id) => {
  return Submission.findByIdAndDelete(id);
};

export const findAll = async () => {
  return Submission.find()
    .populate("quiz", "title course topic")
    .populate("student", "name email")
    .sort({ createdAt: -1 })
    .lean();
};

export const countTotal = async () => {
  return Submission.countDocuments();
};

// submission for dashboard

export const getStudentStats = async (studentId) => {
  const result = await Submission.aggregate([
    {
      $match: {
        student: studentId,
      },
    },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        averageScore: { $avg: "$score" },
        highestScore: { $max: "$score" },
        lowestScore: { $min: "$score" },
        totalScore: { $sum: "$score" },
      },
    },
  ]);

  return (
    result[0] || {
      totalSubmissions: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      totalScore: 0,
    }
  );
};

export const getWeeklySubmissionCount = async (studentId) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return Submission.countDocuments({
    student: studentId,
    createdAt: {
      $gte: weekAgo,
    },
  });
};

export const getPreviousWeekAverageScore = async (studentId) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const result = await Submission.aggregate([
    {
      $match: {
        student: studentId,
        createdAt: {
          $gte: twoWeeksAgo,
          $lt: oneWeekAgo,
        },
      },
    },
    {
      $group: {
        _id: null,
        averageScore: {
          $avg: "$score",
        },
      },
    },
  ]);

  return result[0]?.averageScore || 0;
};

export const getWeeklyAttemptCount = async () => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return Submission.countDocuments({
    createdAt: {
      $gte: weekAgo,
    },
  });
};

export const getPlatformAverageScore = async () => {
  const result = await Submission.aggregate([
    {
      $group: {
        _id: null,
        averageScore: {
          $avg: "$score",
        },
      },
    },
  ]);

  return result[0]?.averageScore || 0;
};

export const getLeaderboard = async (limit = 10) => {
  return Submission.find()
    .populate("student", "name email")
    .populate("quiz", "title")
    .sort({ score: -1 })
    .limit(limit)
    .lean();
};

export const getTopQuizzes = async (limit = 5) => {
  return Submission.aggregate([
    {
      $group: {
        _id: "$quiz",
        averageScore: {
          $avg: "$score",
        },
        attempts: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        averageScore: -1,
      },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "quizzes",
        localField: "_id",
        foreignField: "_id",
        as: "quiz",
      },
    },
    {
      $unwind: "$quiz",
    },
    {
      $project: {
        _id: 1,
        quizTitle: "$quiz.title",
        averageScore: {
          $round: ["$averageScore", 1],
        },
        attempts: 1,
      },
    },
  ]);
};


// // mock data
// import { Submission } from "../data/submission.js";

// let submissions = [...Submission];
// let idCounter = submissions.length + 1;

// /**
//  * Create submission
//  */
// export const create = async (submissionData) => {
//   const now = new Date();

//   const newSubmission = {
//     _id: `sub${idCounter++}`,
//     attempts: 1,
//     firstSubmittedAt: now,
//     lastSubmittedAt: now,
//     createdAt: now,
//     ...submissionData
//   };

//   submissions.push(newSubmission);

//   return newSubmission;
// };

// /**
//  * Update submission
//  */
// export const updateById = async ( id, updateData ) => {
//   const index = submissions.findIndex(
//     (submission) => submission._id === id
//   );

//   if (index === -1) {
//     return null;
//   }

//   submissions[index] = {
//     ...submissions[index],
//     ...updateData,
//     updatedAt: new Date()
//   };

//   return submissions[index];
// };

// /**
//  * Find by id
//  */
// export const findById = async (id) => {
//   return (
//     submissions.find(
//       (submission) => submission._id === id
//     ) || null
//   );
// };

// /**
//  * Find by student
//  */
// export const findByStudentId = async (
//   studentId
// ) => {
//   return submissions.filter(
//     (submission) =>
//       submission.student === studentId
//   );
// };

// /**
//  * Find by quiz
//  */
// export const findByQuizId = async (quizId) => {
//   return submissions.filter(
//     (submission) =>
//       submission.quiz === quizId
//   );
// };

// /**
//  * Find student's submission for quiz
//  */
// export const findByQuizAndStudent = async (quizId, studentId) => {
//     return (
//       submissions.find(
//         (submission) =>
//           submission.quiz === quizId &&
//           submission.student === studentId
//       ) || null
//     );
//   };

// /**
//  * Delete
//  */
// export const deleteById = async (id) => {
//   const index = submissions.findIndex(
//     (submission) => submission._id === id
//   );

//   if (index === -1) {
//     return null;
//   }

//   const [deleted] = submissions.splice(
//     index,
//     1
//   );

//   return deleted;
// };