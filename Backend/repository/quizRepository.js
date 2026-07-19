import Quiz from "../models/Quiz.js";

const findAll = async (filter = {}) => {
  const query = {};

  if (filter.courseId) {
    query.courseId = filter.courseId;
  }

  if (filter.lessonId) {
    query.lessonId = filter.lessonId;
  }

  return Quiz.find(query)
    .populate("courseId", "title")
    .populate("lessonId", "title")
    .populate("createdBy", "name");
};

const findById = async (id) => {
  return Quiz.findById(id)
    .populate("courseId", "title")
    .populate("lessonId", "title")
    .populate("createdBy", "name");
};

const create = async (data) => {
  return Quiz.create(data);
};

const updateById = async (id, data) => {
  return Quiz.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  );
};

const deleteById = async (id) => {
  return Quiz.findByIdAndDelete(id);
};

const countAll = () => {
  return Quiz.countDocuments();
};

export {
  findAll,
  findById,
  create,
  updateById,
  deleteById, 
  countAll
};
