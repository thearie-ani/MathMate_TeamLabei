import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Topic content is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    estimatedMinutes: {
      type: Number,
      default: 15,
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

topicSchema.index({ course: 1, order: 1 });
topicSchema.index({ title: 'text' });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;