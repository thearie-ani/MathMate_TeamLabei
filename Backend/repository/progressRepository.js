import Enrollment from "../models/Enrollment.js";
import CourseProgress from "../models/Progress.js";

// enrollment

export const createEnrollment = async (data) => {
  return Enrollment.create(data);
};

export const findByStudentAndCourse = async (studentId, courseId) => {
  return Enrollment.findOne({
    student: studentId,
    course: courseId,
  });
};

export const findByStudent = async (studentId) => {
  return Enrollment.find({
    student: studentId,
    isActive: true,
  })
    .populate("course")
    .sort({ createdAt: -1 })
    .lean();
};

export const findByCourse = async (courseId) => {
  return Enrollment.find({
    course: courseId,
    isActive: true,
  })
    .populate("student", "name email")
    .lean();
};

export const countByStudent = async (studentId) => {
  return Enrollment.countDocuments({
    student: studentId,
    isActive: true,
  });
};

export const countByCourse = async (courseId) => {
  return Enrollment.countDocuments({
    course: courseId,
    isActive: true,
  });
};

export const countTotalEnrollments = async () => {
  return Enrollment.countDocuments({
    isActive: true,
  });
};

export const updateEnrollment = async (
  studentId,
  courseId,
  data
) => {
  return Enrollment.findOneAndUpdate(
    {
      student: studentId,
      course: courseId,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deactivateEnrollment = async ( studentId, courseId ) => {
  return Enrollment.findOneAndUpdate(
    {
      student: studentId,
      course: courseId,
    },
    {
      isActive: false,
    },
    {
      new: true,
    }
  );
};

// progress

export const findProgress = async ( studentId, courseId ) => {
  return CourseProgress.findOne({
    student: studentId,
    course: courseId,
  })
    .populate("completedTopics", "title")
    .populate("lastAccessedTopic", "title");
};

export const findAllProgressByStudent = async ( studentId) => {
  return CourseProgress.find({
    student: studentId,
  })
    .populate("course", "title icon")
    .populate("completedTopics", "title")
    .populate("lastAccessedTopic", "title")
    .lean();
};

export const createProgress = async (data) => {
  return CourseProgress.create(data);
};

export const updateProgress = async ( studentId, courseId, data ) => {
  return CourseProgress.findOneAndUpdate(
    {
      student: studentId,
      course: courseId,
    },
    data,
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );
};

export const markTopicCompleted = async ( studentId, courseId, topicId, progressPercentage ) => {
  return CourseProgress.findOneAndUpdate(
    {
      student: studentId,
      course: courseId,
    },
    {
      $addToSet: {
        completedTopics: topicId,
      },
      progressPercentage,
      lastAccessedTopic: topicId,
      ...(progressPercentage === 100 && {
        completedAt: new Date(),
      }),
    },
    {
      new: true,
      upsert: true,
    }
  );
};

export const updateLastAccessedTopic = async ( studentId, courseId, topicId ) => {
  return CourseProgress.findOneAndUpdate(
    {
      student: studentId,
      course: courseId,
    },
    {
      lastAccessedTopic: topicId,
    },
    {
      new: true,
    }
  );
};

export const resetProgress = async ( studentId, courseId ) => {
  return CourseProgress.findOneAndUpdate(
    {
      student: studentId,
      course: courseId,
    },
    {
      completedTopics: [],
      progressPercentage: 0,
      lastAccessedTopic: null,
      completedAt: null,
    },
    {
      new: true,
    }
  );
};

export const deleteProgress = async ( studentId, courseId) => {
  return CourseProgress.findOneAndDelete({
    student: studentId,
    course: courseId,
  });
};

export const getStudentStats = async (studentId) => {
  const result = await CourseProgress.aggregate([
    {
      $match: {
        student: studentId,
      },
    },
    {
      $group: {
        _id: null,
        enrolledCourses: {
          $sum: 1,
        },
        averageProgress: {
          $avg: "$progressPercentage",
        },
        completedCourses: {
          $sum: {
            $cond: [
              {
                $eq: ["$progressPercentage", 100],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  return (
    result[0] || {
      enrolledCourses: 0,
      averageProgress: 0,
      completedCourses: 0,
    }
  );
};


// // mock data
// import StudentTopicProgress from "../data/progress.js";

// let progresses = [...StudentTopicProgress];
// let idCounter = progresses.length + 1;

// /**
//  * Mark a topic as completed
//  */
// export const markTopicCompleted = async (
//   studentId,
//   topicId
// ) => {
//   const existing = progresses.find(
//     (p) =>
//       p.student === studentId &&
//       p.topic === topicId
//   );

//   if (existing) {
//     existing.completed = true;
//     existing.completedAt = new Date();

//     return existing;
//   }

//   const newProgress = {
//     _id: `progress${idCounter++}`,
//     student: studentId,
//     topic: topicId,
//     completed: true,
//     completedAt: new Date()
//   };

//   progresses.push(newProgress);

//   return newProgress;
// };

// /**
//  * Count completed topics
//  */
// export const countCompletedTopics = async (
//   studentId,
//   topicIds
// ) => {
//   return progresses.filter(
//     (p) =>
//       p.student === studentId &&
//       p.completed &&
//       topicIds.includes(p.topic)
//   ).length;
// };

// /**
//  * Get all progress records for a student
//  */
// export const findByStudent = async (
//   studentId
// ) => {
//   return progresses.filter(
//     (p) => p.student === studentId
//   );
// };