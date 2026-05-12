import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  iconUrl: { type: String }, // For the certificate image or logo
  link: { type: String },
}, { timestamps: true });

export const CertificationModel = (mongoose.models.Certification || mongoose.model('Certification', CertificationSchema)) as mongoose.Model<any>;
