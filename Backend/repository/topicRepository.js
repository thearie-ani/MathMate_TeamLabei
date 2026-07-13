import Topic from "../models/Topics.js";

export const findByCourse = (courseId) => {
  return Topic.find({
    course: courseId,
    isPublished: true
  }).sort({ order: 1 });
};

export const findById = (id) => {
  return Topic.findById(id);
};

export const create = (data) => {
  return Topic.create(data);
};

export const updateById = (id, data) => {
  return Topic.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

export const deleteById = (id) => {
  return Topic.findByIdAndDelete(id);
};

export const countAll = () => {
  return Topic.countDocuments();
};

export const countTopicsForCourse = (courseId) => {
  return Topic.countDocuments({ course: courseId});
}

// // mock data
// import Topics from "../data/topic.js";
// import Topic from "../models/Topics.js";

// let topics = [...Topics];
// let idCounter = topics.length + 1;

// /**
//  * Get topics by course (only published)
//  */
// export const findByCourse = async (courseId) => {
//   return topics
//     .filter(
//       (topic) =>
//         topic.course === courseId &&
//         topic.isPublished === true
//     )
//     .sort((a, b) => a.order - b.order);
// };

// /**
//  * Get topic by id
//  */
// export const findById = async (id) => {
//   return (
//     topics.find((topic) => topic._id === id) ||
//     null
//   );
// };

// /**
//  * Create topic
//  */
// export const create = async (data) => {
//   const newTopic = {
//     _id: `topic${idCounter++}`,

//     course: data.course,
//     title: data.title,
//     description: data.description || "",
//     content: data.content || "",

//     order: data.order || topics.length + 1,
//     isPublished: data.isPublished ?? true,

//     createdAt: new Date(),
//     updatedAt: new Date()
//   };

//   topics.push(newTopic);

//   return newTopic;
// };

// /**
//  * Update topic
//  */
// export const updateById = async (id, data) => {
//   const index = topics.findIndex(
//     (topic) => topic._id === id
//   );

//   if (index === -1) return null;

//   topics[index] = {
//     ...topics[index],
//     ...data,
//     updatedAt: new Date()
//   };

//   return topics[index];
// };

// /**
//  * Delete topic
//  */
// export const deleteById = async (id) => {
//   const index = topics.findIndex(
//     (topic) => topic._id === id
//   );

//   if (index === -1) return null;

//   const [deleted] = topics.splice(index, 1);

//   return deleted;
// };