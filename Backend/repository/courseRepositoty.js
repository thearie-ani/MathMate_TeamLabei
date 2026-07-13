import Course from "../models/Course.js";

export const findAll = (filter = {}) => {
  return Course.find(filter);
};

export const findById = (id) => {
  return Course.findById(id);
};

export const create = (data) => {
  return Course.create(data);
};

export const updateById = (id, data) => {
  return Course.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

export const deleteById = (id) => {
  return Course.findByIdAndDelete(id);
};

export const countAll = () => {
  return Course.countDocuments()
};

export const countPublished = () => {
  return Course.countDocuments({ isPublished: true });
};

// // mock data
// import { Courses } from "../data/course.js";

// let courses = [...Courses];
// let idCounter = courses.length + 1;

// /**
//  * Get all courses
//  */
// export const findAll = async (filter = {}) => {
//   return courses.filter((course) => {
//     if (
//       filter.isPublished !== undefined &&
//       course.isPublished !== filter.isPublished
//     ) {
//       return false;
//     }

//     return true;
//   });
// };

// /**
//  * Get course by id
//  */
// export const findById = async (id) => {
//   return courses.find((course) => course._id === id) || null;
// };

// /**
//  * Create course
//  */
// export const create = async (data) => {
//   const newCourse = {
//     _id: `course${idCounter++}`,

//     title: data.title,
//     description: data.description || "",
//     thumbnail: data.thumbnail || "",

//     isPublished: data.isPublished ?? true,

//     createdBy: data.createdBy,

//     createdAt: new Date(),
//     updatedAt: new Date()
//   };

//   courses.push(newCourse);

//   return newCourse;
// };

// /**
//  * Update course
//  */
// export const updateById = async (id, data) => {
//   const index = courses.findIndex(
//     (course) => course._id === id
//   );

//   if (index === -1) {
//     return null;
//   }

//   courses[index] = {
//     ...courses[index],
//     ...data,
//     updatedAt: new Date()
//   };

//   return courses[index];
// };

// /**
//  * Delete course
//  */
// export const deleteById = async (id) => {
//   const index = courses.findIndex(
//     (course) => course._id === id
//   );

//   if (index === -1) {
//     return null;
//   }

//   const [deleted] = courses.splice(index, 1);

//   return deleted;
// };
