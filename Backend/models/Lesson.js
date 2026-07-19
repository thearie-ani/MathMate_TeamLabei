import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    chapter: {
      type: Number,
      required: true,
      default: 0,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    content: {
      type: String,
      required: [true, 'Topic content is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    completionCount: {
      type: Number,
      default: 0,
    },
    averageScore: {
      // Average quiz score for quizzes linked to this topic
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

lessonSchema.index({ courseId: 1, slug: 1 }, { unique: true });
lessonSchema.index({ courseId: 1, chapter: 1, order: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;