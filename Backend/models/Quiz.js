import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
  },
  options: {
    type: [String],
    validate: {
      validator: (v) => v.length >= 2 && v.length <= 6,
      message: 'A question must have between 2 and 6 options',
    },
    required: true,
  },
  correctIndex: {
    type: Number,
    required: [true, 'Correct answer index is required'],
  },
  explaination: {
    type: String,
    required: [true, 'Explaination is required'],
  },
  points: {
    type: Number,
    default: 1,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (v) => v.length >= 1,
        message: 'A quiz must have at least one question',
      },
    },

    passingScore: {
      type: Number, // percentage
      default: 60,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

quizSchema.index({ course: 1, topic: 1 });
quizSchema.index({ isPublished: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;