import User from "../models/User.js";

export const createUser = (data) => {
    return User.create(data);
};

export const findUserByEmail = (email) => {
    return User.findOne({email});
};

export const findUserById = (id) => {
    return User.findById(id);
};

export const updateUser = (id, data) => {
    return User.findByIdAndUpdate(id, data, { new: true });
};

export const findUserByResetToken = (token) => {
    return User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
};

export const updateProfile = (id, profileData) => {
    const update = {};

    if (profileData.name !== undefined) {
      update["profile.name"] = profileData.name;
    }

    if (profileData.avatar !== undefined) {
      update["profile.avatar"] = profileData.avatar;
    }

    if (profileData.bio !== undefined) {
      update["profile.bio"] = profileData.bio;
    }

    return User.findByIdAndUpdate(
      id,
      update,
      {
        new: true,
        runValidators: true,
      }
    );
}