import Quiz from "../models/Quiz.js";

const findAll = async (filter = {}) => {
  const query = {};

  if (filter.course) {
    query.course = filter.course;
  }

  return Quiz.find(query);
};

const findById = async (id) => {
  return Quiz.findById(id);
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

// // mock data
// import { Quizzes } from "../data/quiz.js";

// let quizzes = [...Quizzes];
// let idCounter = quizzes.length + 1;


// const findAll = async (filter = {}) => {
//   return quizzes.filter((q) => {
//     if (filter.course && q.course !== filter.course) return false;
//     if (filter.topic && q.topic !== filter.topic) return false;
//     if (filter.grade && q.grade !== Number(filter.grade)) return false;
//     return true;
//   });
// };

// const findById = async (id) => {
//   return quizzes.find((q) => q._id === id) || null;
// };

// const create = async (data) => {
//   const newQuiz = {
//     _id: `q${idCounter++}`,
//     ...data,
//     isPublished: data.isPublished || false
//   };
//   quizzes.push(newQuiz);
//   return newQuiz;
// };

// const updateById = async (id, data) => {
//   const index = quizzes.findIndex((q) => q._id === id);
//   if (index === -1) return null;
//   quizzes[index] = { ...quizzes[index], ...data };
//   return quizzes[index];
// };

// const deleteById = async (id) => {
//   const index = quizzes.findIndex((q) => q._id === id);
//   if (index === -1) return null;
//   const [deleted] = quizzes.splice(index, 1);
//   return deleted;
// };

// export {findAll, findById, create, updateById, deleteById};