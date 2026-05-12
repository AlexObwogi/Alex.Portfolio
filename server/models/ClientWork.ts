import mongoose from 'mongoose';

const clientWorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  clientName: { type: String, required: true },
  description: String,
  platform: String,
  serviceType: String, // To link with Services (e.g., 'Cloud Security', 'Web Scaling')
  imageUrl: String,
  videoUrl: String,
  techStack: [String],
  liveUrl: String,
  date: String,
  createdAt: { type: Date, default: Date.now }
});

export const ClientWorkModel = mongoose.model('ClientWork', clientWorkSchema);
