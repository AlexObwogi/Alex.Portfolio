import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
  githubRepo: { type: String },
  repoUrl: { type: String, required: true },
  liveUrl: { type: String, required: true },
  languages: [{ type: String }],
  techStack: [{ type: String }],
  technicalSummary: { type: String },
  aiDocsAnalysis: { type: String },
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
