import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  studentEmail: String,
  assignedBy: String
});

export default mongoose.model("Task", taskSchema);
