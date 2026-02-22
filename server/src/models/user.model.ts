import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,  // so that password is not returned by default when querying users
  },
});

export const User = mongoose.model("User", userSchema);
