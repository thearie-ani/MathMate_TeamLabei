import * as courseRepo from "../repository/courseRepositoty.js";
import * as topicRepo from "../repository/topicRepository.js";
import * as enrollmentRepo from "../repository/progressRepository.js";
import Course from "../models/Course.js";
import Topic from "../models/Topics.js";

// courses

export const getAllCourses = async (req, res) => {
  try {
    const role = req.user?.role || "guest";

    const filter = {};
    if (role !== "admin") filter.isPublished = true;

    const courses = await courseRepo.findAll(filter);

    return res.status(200).json({
      success: true,
      message: "Courses retrieved",
      data: { courses, total: courses.length },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await courseRepo.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Guests and students can only see published courses
    const role = req.user?.role || "guest";
    if (role !== "admin" && !course.isPublished) {
      return res.status(403).json({
        success: false,
        message: "This course is not available yet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course retrieved",
      data: { course },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, isPublished } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const course = await courseRepo.create({
      title,
      description,
      isPublished: isPublished,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: { course },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await courseRepo.updateById(req.params.courseId, req.body);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated",
      data: { course },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await courseRepo.deleteById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// topics

export const getTopicsByCourse = async (req, res) => {
  try {
    const course = await courseRepo.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const topics = await topicRepo.findByCourse(req.params.courseId);

    return res.status(200).json({
      success: true,
      message: "Topics retrieved",
      data: { topics },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTopicById = async (req, res) => {
  try {
    const topic = await topicRepo.findById(req.params.topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic retrieved",
      data: { topic },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createTopic = async (req, res) => {
  try {
    const { title, content, order, estimatedMinutes } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const course = await courseRepo.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const topic = await topicRepo.create({
      title,
      content,
      order: order ?? 0,
      estimatedMinutes,
      course: req.params.courseId,
    });

    // Keep course topicCount in sync
    await courseRepo.updateById(req.params.courseId, {
      $inc: { topicCount: 1 },
    });

    return res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: { topic },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateTopic = async (req, res) => {
  try {
    const topic = await topicRepo.updateById(req.params.topicId, req.body);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic updated",
      data: { topic },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topic = await topicRepo.deleteById(req.params.topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Keep course topicCount in sync
    await courseRepo.updateById(topic.course.toString(), {
      $inc: { topicCount: -1 },
    });

    return res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// enrollments

export const enrollCourse = async (req, res) => {
  try {
    const course = await courseRepo.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.isPublished) {
      return res.status(403).json({
        success: false,
        message: "This course is not available for enrollment",
      });
    }

    // check already enrolled
    const existing = await enrollmentRepo.findByStudentAndCourse(
      req.user._id,
      req.params.courseId
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await enrollmentRepo.create({
      student: req.user._id,
      course: req.params.courseId,
    });

    // create empty progress record for this student + course
    await enrollmentRepo.createProgress({
      student: req.user._id,
      course: req.params.courseId,
      completedTopics: [],
      progressPercentage: 0,
    });

    // increment course enrollment count
    await courseRepo.updateById(req.params.courseId, {
      $inc: { enrollmentCount: 1 },
    });

    return res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      data: { enrollment },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const enrollments = await enrollmentRepo.findByStudent(req.user._id);

    return res.status(200).json({
      success: true,
      message: "My courses retrieved",
      data: { courses: enrollments.map((e) => e.course) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// progresses

export const completeTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await topicRepo.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // must be enrolled
    const enrollment = await enrollmentRepo.findByStudentAndCourse(
      req.user._id,
      topic.course.toString()
    );

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // get current progress
    let progress = await enrollmentRepo.findProgress(
      req.user._id,
      topic.course.toString()
    );

    if (!progress) {
      progress = await enrollmentRepo.createProgress({
        student: req.user._id,
        course: topic.course,
        completedTopics: [],
        progressPercentage: 0,
      });
    }

    // avoid duplicate completions
    const alreadyDone = progress.completedTopics
      .map((id) => id.toString())
      .includes(topicId);

    if (alreadyDone) {
      return res.status(200).json({
        success: true,
        message: "Topic already completed",
        data: { progress },
      });
    }

    // add topic to completed list and recalculate percentage
    const totalTopics = await topicRepo.countByCourse(topic.course.toString());
    const newCompleted = [...progress.completedTopics, topicId];
    const percentage =
      totalTopics > 0 ? Math.round((newCompleted.length / totalTopics) * 100) : 0;

    const updatedProgress = await enrollmentRepo.updateProgress(
      req.user._id,
      topic.course.toString(),
      {
        completedTopics: newCompleted,
        progressPercentage: percentage,
        lastAccessedTopic: topicId,
        ...(percentage === 100 && { completedAt: new Date() }),
      }
    );

    return res.status(200).json({
      success: true,
      message: "Topic marked as complete",
      data: { progress: updatedProgress },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    // must be enrolled
    const enrollment = await enrollmentRepo.findByStudentAndCourse(
      req.user._id,
      req.params.courseId
    );

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const progress = await enrollmentRepo.findProgress(
      req.user._id,
      req.params.courseId
    );

    const totalTopics = await topicRepo.countByCourse(req.params.courseId);

    return res.status(200).json({
      success: true,
      message: "Course progress retrieved",
      data: {
        completedTopics: progress?.completedTopics?.length || 0,
        totalTopics,
        progressPercentage: progress?.progressPercentage || 0,
        completedAt: progress?.completedAt || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const allProgress = await enrollmentRepo.findAllProgressByStudent(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Progress retrieved",
      data: { progress: allProgress },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};