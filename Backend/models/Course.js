import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
     coverImageUrl: {
      type: String,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    topicCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ isPublished: 1});
courseSchema.index({ createdAt: -1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;