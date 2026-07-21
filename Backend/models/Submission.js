import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  selectedIndex: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  correctIndex: {          // NEW — without this, Mongoose strips it on save
    type: Number,
  },
  explaination: {          // NEW — matches the Question schema's spelling
    type: String,
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
});

const quizSubmissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    chapter: {
      type: Number,
      required: true,
      default: 0,
    },
    answers: [answerSchema],
    score: {
      type: Number, 
      required: true,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

quizSubmissionSchema.index({ student: 1 });
quizSubmissionSchema.index({ quiz: 1 });
quizSubmissionSchema.index({ student: 1, quiz: 1 });
quizSubmissionSchema.index({ createdAt: -1 });
quizSubmissionSchema.index({ score: -1 });

const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);
export default QuizSubmission;