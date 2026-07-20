import * as courseRepo from "../repository/courseRepositoty.js";
import * as lessonRepo from "../repository/lessonRepository.js";
import * as enrollmentRepo from "../repository/progressRepository.js";

const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

// courses

export const getAllCourses = async (req, res) => {
  try {
    const role = req.user?.role;

const filter =
  role === "admin"
    ? {}
    : { status: "published" };

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

    const role = req.user?.role || "guest";
    if (role !== "admin" && course.status !== "published") {
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

export const getCourseBySlug = async (req, res) => {
  try {
    const course = await courseRepo.findBySlug(req.params.slug);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const role = req.user?.role || "guest";
    if (role !== "admin" && course.status !== "published") {
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
    const { title, description, thumbnail, sourceUrl, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const slug = req.body.slug ? generateSlug(req.body.slug) : generateSlug(title);

    const existing = await courseRepo.findBySlug(slug);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A course with slug "${slug}" already exists`,
      });
    }

    const course = await courseRepo.create({
      title,
      slug,
      description,
      thumbnail,
      sourceUrl,
      status: status || "draft",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: { course },
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, sourceUrl, status, slug } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (thumbnail !== undefined) updates.thumbnail = thumbnail;
    if (sourceUrl !== undefined) updates.sourceUrl = sourceUrl;
    if (status !== undefined) updates.status = status;

    if (slug || title) {
      const newSlug = generateSlug(slug || title);
      const existing = await courseRepo.findBySlug(newSlug);
      if (existing && existing._id.toString() !== req.params.courseId) {
        return res.status(409).json({
          success: false,
          message: `A course with slug "${newSlug}" already exists`,
        });
      }
      updates.slug = newSlug;
    }

    const course = await courseRepo.updateById(req.params.courseId, updates);

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
    const course = await courseRepo.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // cascade delete dependent data before removing the course
    await lessonRepo.deleteByCourse(req.params.courseId);
    await enrollmentRepo.deleteByCourse(req.params.courseId);
    await enrollmentRepo.deleteProgressByCourse(req.params.courseId);
    await courseRepo.deleteById(req.params.courseId);

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

// lessons

export const getLessonsByCourse = async (req, res) => {
  try {
    const course = await courseRepo.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const role = req.user?.role;

    const filter =
      role === "admin"
        ? {}
        : { status: "published" };

    const lessons = await lessonRepo.findByCourse(req.params.courseId, filter);

    lessons.forEach((l) => {
  const content = l.content || "";

  const mathIndex =
    content.indexOf("<math") !== -1
      ? content.indexOf("<math")
      : content.search(/\$|\\\(|\\\[/);

  console.log(
    `MATH SNIPPET [${l.slug}]:`,
    JSON.stringify(
      content.slice(
        Math.max(mathIndex - 50, 0),
        mathIndex + 500
      )
    )
  );
});

    return res.status(200).json({
      success: true,
      message: "Lessons retrieved",
      data: { lessons },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export const getLessonById = async (req, res) => {
  try {
    const lesson = await lessonRepo.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const role = req.user?.role || "guest";
    if (role !== "admin" && lesson.status !== "published") {
      return res.status(403).json({
        success: false,
        message: "This lesson is not available yet",
      });
    }

    const content = lesson.content || "";

    const mathIndex =
      content.indexOf("<math") !== -1
        ? content.indexOf("<math")
        : content.search(/\$|\\\(|\\\[/);

    console.log(
      `MATH SNIPPET [${lesson.slug}]:`,
      JSON.stringify(
        content.slice(
          Math.max(mathIndex - 50, 0),
          mathIndex + 500
        )
      )
    );

    return res.status(200).json({
      success: true,
      message: "Lesson retrieved",
      data: { lesson },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createLesson = async (req, res) => {
  try {
    const { title, content, chapter, order, status, sourceUrl } = req.body;

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

    const slug = req.body.slug ? generateSlug(req.body.slug) : generateSlug(title);

    const existing = await lessonRepo.findBySlug(req.params.courseId, slug);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A lesson with slug "${slug}" already exists in this course`,
      });
    }

    const lesson = await lessonRepo.create({
      title,
      slug,
      courseId: req.params.courseId,
      chapter: chapter ?? 0,
      order: order ?? 0,
      content,
      status: status || "draft",
      sourceUrl: sourceUrl || "",
    });

    // keep course topicCount in sync
    await courseRepo.updateById(req.params.courseId, {
      $inc: { topicCount: 1 },
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: { lesson },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { title, slug, chapter, order, content, status, sourceUrl } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (chapter !== undefined) updates.chapter = chapter;
    if (order !== undefined) updates.order = order;
    if (content !== undefined) updates.content = content;
    if (status !== undefined) updates.status = status;
    if (sourceUrl !== undefined) updates.sourceUrl = sourceUrl;

    if (slug || title) {
      const existingLesson = await lessonRepo.findById(req.params.lessonId);
      if (!existingLesson) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found",
        });
      }

      const newSlug = generateSlug(slug || title);
      const duplicate = await lessonRepo.findBySlug(existingLesson.courseId, newSlug);
      if (duplicate && duplicate._id.toString() !== req.params.lessonId) {
        return res.status(409).json({
          success: false,
          message: `A lesson with slug "${newSlug}" already exists in this course`,
        });
      }
      updates.slug = newSlug;
    }

    const lesson = await lessonRepo.updateById(req.params.lessonId, updates);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lesson updated",
      data: { lesson },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const lesson = await lessonRepo.deleteById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // keep course topicCount in sync
    await courseRepo.updateById(lesson.courseId.toString(), {
      $inc: { topicCount: -1 },
    });

    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
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

    if (course.status !== "published") {
      return res.status(403).json({
        success: false,
        message: "This course is not available for enrollment",
      });
    }

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
console.log("req.user:", req.user);
console.log("courseId:", req.params.courseId);

const enrollment = await enrollmentRepo.createEnrollment({
  student: req.user._id,
  course: req.params.courseId,
});

    // create empty progress record for this student + course
    await enrollmentRepo.createProgress({
      student: req.user._id,
      course: req.params.courseId,
      completedLessons: [],
      progressPercentage: 0,
    });
    console.log("Progress created");

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
    console.error("FULL ERROR:");
  console.error(error);
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

export const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await lessonRepo.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // must be enrolled
    const enrollment = await enrollmentRepo.findByStudentAndCourse(
      req.user._id,
      lesson.courseId.toString()
    );

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    let progress = await enrollmentRepo.findProgress(
      req.user._id,
      lesson.courseId.toString()
    );

    if (!progress) {
      progress = await enrollmentRepo.createProgress({
        student: req.user._id,
        course: lesson.courseId,
        completedLessons: [],
        progressPercentage: 0,
      });
    }

    // avoid duplicate completions
    const alreadyDone = progress.completedLessons
      .map((id) => id.toString())
      .includes(lessonId);

    if (alreadyDone) {
      return res.status(200).json({
        success: true,
        message: "Lesson already completed",
        data: { progress },
      });
    }

    // add lesson to completed list and recalculate percentage
    const totalLessons = await lessonRepo.countPublishedByCourse(
      lesson.courseId.toString()
    );
    const newCompleted = [
    ...new Set([
      ...progress.completedLessons.map(
        id=>id.toString()
      ),
      lessonId
    ])
    ];
    const percentage =
      totalLessons > 0 ? Math.round((newCompleted.length / totalLessons) * 100) : 0;

    const updatedProgress = await enrollmentRepo.updateProgress(
      req.user._id,
      lesson.courseId.toString(),
      {
        completedLessons: newCompleted,
        progressPercentage: percentage,
        lastAccessedLesson: lessonId,
        ...(percentage === 100 && { completedAt: new Date() }),
      }
    );

    return res.status(200).json({
      success: true,
      message: "Lesson marked as complete",
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

    const totalLessons = await lessonRepo.countPublishedByCourse(req.params.courseId);

    return res.status(200).json({
      success: true,
      message: "Course progress retrieved",
      data: {
        completedLessons: progress?.completedLessons?.length || 0,
        totalLessons,
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
export const getLessonStatus = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;


    // Check enrollment
    const enrollment =
      await enrollmentRepo.findByStudentAndCourse(
        req.user._id,
        courseId
      );


    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }



    const progress =
      await enrollmentRepo.findProgress(
        req.user._id,
        courseId
      );



    const completed =
      progress?.completedLessons
        ?.map(id => id.toString())
        .includes(lessonId)
        || false;



    return res.status(200).json({

      success:true,

      data:{
        completed
      }

    });


  } catch(error){

    return res.status(500).json({

      success:false,

      message:"Server error",

      error:error.message

    });

  }
};