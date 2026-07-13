import User from "../models/User.js";

export const createUser = (data) => User.create(data);

export const findAllUsers = ({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 } = {}) => {
  return User.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
};

export const findUserById = (id) => User.findById(id);

export const findUserByEmail = (email, select = "") =>
  User.findOne({ email }).select(select);

export const findUserByUsername = (username) =>
  User.findOne({ username });

export const updateUser = (id, data) =>
  User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

export const countUsers = (filter = {}) =>
  User.countDocuments(filter);

export const countByRole = (role) =>
  User.countDocuments({ role });

export const findUserByResetToken = (token) =>
  User.findOne({
    passwordResetToken: token,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  }).select("+passwordResetToken +passwordResetExpires");

export const findActiveToday = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  return User.countDocuments({
    role: "student",
    lastSeen: { $gte: start },
  });
};

export const findRecentRegistrations = (limit = 10) =>
  User.find({ role: "student" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

export const updateProfile = (id, profileData) => {
  const update = {};

  if (profileData.username !== undefined)
    update.username = profileData.username;

  if (profileData.bio !== undefined)
    update.bio = profileData.bio;

  if (profileData.avatarUrl !== undefined)
    update["avatar.url"] = profileData.avatarUrl;

  if (profileData.avatarPublicId !== undefined)
    update["avatar.publicId"] = profileData.avatarPublicId;

  return User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
};