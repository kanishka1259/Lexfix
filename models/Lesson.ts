import mongoose, { Schema, model, models } from 'mongoose';

const LessonSchema = new Schema({
  creatorId: { type: String, required: true }, // Educator/Parent-Educator ID
  title: {
    en: { type: String, required: true },
    ta: { type: String, required: true }
  },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  content: [{
    type: { type: String, enum: ['vocabulary', 'grammar', 'practice', 'quiz'] },
    data: Schema.Types.Mixed,
    teachingGuide: {
      script: String,
      adaptations: {
        dyslexia: String,
        adhd: String,
        autism: String,
        apd: String
      }
    }
  }],
  niosCompetencies: [String], // NIOS codes for reporting
  accessibility: {
    dyslexiaAdaptations: String,
    adhdAdaptations: String,
    autismAdaptations: String
  }
}, { timestamps: true });

export const Lesson = models.Lesson || model('Lesson', LessonSchema);