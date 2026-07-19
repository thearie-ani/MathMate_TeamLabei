import Course from "../models/Course.js";

export const findAll = (filter = {}) => {
  return Course.find(filter);
};

export const findById = (id) => {
  return Course.findById(id);
};

export const findBySlug = (slug) => {
  return Course.findOne({ slug });
};

export const create = (data) => {
  return Course.create(data);
};

export const updateById = (id, data) => {
  return Course.findByIdAndUpdate(id, data, { new: true });
};

export const deleteById = (id) => {
  return Course.findByIdAndDelete(id);
};

export const countAll = () => {
  return Course.countDocuments();
};

export const countPublished = () => {
  return Course.countDocuments({ status: "published" });
};