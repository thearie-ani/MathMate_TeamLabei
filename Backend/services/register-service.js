import User from "../models/User.js";
import bcrypt from "bcryptjs";

export default async function registerService({ name, username, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: username ?? name,
    email,
    password: hashedPassword
  });

  return { success: true, user };
}