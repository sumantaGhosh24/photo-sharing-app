"use server";

import bcrypt from "bcryptjs";

import UserModel from "@/models/userModel";

export async function registerUser({name, email, password, avatar}) {
  try {
    const user = await UserModel.findOne({email});
    if (user) {
      throw new Error("This email already registered, try another one.");
    }
    const hashed_password = await bcrypt.hash(password, 10);
    console.log(hashed_password);
    const newUser = new UserModel({
      name: name?.toLowerCase(),
      email: email?.toLowerCase(),
      password: hashed_password,
      avatar,
    });
    await newUser.save();
  } catch (error) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
}
