import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 4,
    trim: true,
    required: true
  },
  phoneNumber: {
    type: String,
    min: 10,
    max: 10,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    min: 8,
    required: true
  },
  role: {
    type: String,
    enum: ['Owner', 'Seeker'],
    required: true
  }
},{timestamps:true});

export const UserModel = mongoose.model('user', userSchema);
