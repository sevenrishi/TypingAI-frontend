import mongoose, { Document, Schema } from 'mongoose';

export type SessionType = 'practice' | 'test' | 'battle';

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  type: SessionType;
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  text: string;
  difficulty?: string;
  mode?: string;
  battleResult?: 'win' | 'loss' | 'draw';
  opponent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['practice', 'test', 'battle'], required: true },
  wpm: { type: Number, required: true },
  cpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  errors: { type: Number, required: true },
  duration: { type: Number, required: true },
  text: { type: String, required: true },
  difficulty: { type: String },
  mode: { type: String },
  battleResult: { type: String, enum: ['win', 'loss', 'draw'] },
  opponent: { type: String }
}, { timestamps: true });

export default mongoose.model<ISession>('Session', SessionSchema);
