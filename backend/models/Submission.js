import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  studentEmail: String,
  taskTitle: String,
  content: String,
  score: Number
});

export default mongoose.model("Submission", submissionSchema);
