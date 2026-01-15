import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email?: string;
  passwordHash?: string;
  displayName?: string;
  avatarId?: string;
  bestWPM?: number;
  averageAccuracy?: number;
  history: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  displayName: { type: String },
  avatarId: { type: String, default: 'avatar-1' },
  bestWPM: { type: Number, default: 0 },
  averageAccuracy: { type: Number, default: 0 },
  history: [{ type: Schema.Types.ObjectId, ref: 'TestResult' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
