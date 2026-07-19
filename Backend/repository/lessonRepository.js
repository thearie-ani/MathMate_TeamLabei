import Lesson from "../models/Lesson.js";

export const findByCourse = (courseId, filter = {}) => {
  return Lesson.find({ courseId, ...filter }).sort({ chapter: 1, order: 1 });
};

export const findById = (id) => {
  return Lesson.findById(id).populate("courseId", "title slug");
};

export const findBySlug = (courseId, slug) => {
  return Lesson.findOne({ courseId, slug });
};

export const create = (data) => {
  return Lesson.create(data);
};

export const updateById = (id, data) => {
  return Lesson.findByIdAndUpdate(id, data, { new: true });
};

export const deleteById = (id) => {
  return Lesson.findByIdAndDelete(id);
};

export const deleteByCourse = (courseId) => {
  return Lesson.deleteMany({ courseId });
};

export const countAll = () => {
  return Lesson.countDocuments();
};

export const countByCourse = (courseId) => {
  return Lesson.countDocuments({ courseId });
};

export const countPublishedByCourse = (courseId) => {
  return Lesson.countDocuments({ courseId, status: "published" });
};