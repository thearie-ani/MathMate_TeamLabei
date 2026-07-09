import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

export const seedDefaultUsers = async () => {
  try {
    // Default Admin
    const admin = await User.findOne({
      email: "sokunthearyreuk@gmail.com",
    });

    if (!admin) {
      await User.create({
        username: "sokuntheary",
        email: "sokunthearyreuk@gmail.com",
        password: await hashPassword("admin@01"),
        role: "admin",
        isActive: true,
        isVerified: true,
      });

      console.log("Default admin created");
    }

    // Default Student
    const student = await User.findOne({
      email: "sokunthearyroerk@gmail.com",
    });

    if (!student) {
      await User.create({
        username: "Nio Torry",
        email: "sokunthearyroerk@gmail.com",
        password: await hashPassword("haha11@"),
        role: "student",
        isActive: true,
        isVerified: true,
      });

      console.log("Default student created");
    }

    console.log("User seeding completed");
  } catch (error) {
    console.error("Seed Error:", error.message);
  }
};