import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
  name: String,
  highScore: Number,
});

const stepsSchema = new Schema({
  description: String,
  isComplete: Boolean,
});

const itemsSchema = new Schema({
  name: String,
  steps: [stepsSchema],
  userId: Types.ObjectId,
  isComplete: Boolean,
});

export const User = model("User", userSchema);
export const Item = model("Item", itemsSchema);
