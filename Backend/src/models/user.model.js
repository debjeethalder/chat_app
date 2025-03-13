import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profilePic: {
    type: String,
    default: "",
  },
},
{
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;