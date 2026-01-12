import mongoose, { Document, Schema } from 'mongoose';

export interface ITestResult extends Document {
  user?: mongoose.Types.ObjectId;
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  text: string;
  room?: string;
}

const TestResultSchema = new Schema<ITestResult>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  wpm: { type: Number, required: true },
  cpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  errors: { type: Number, required: true },
  duration: { type: Number, required: true },
  text: { type: String, required: true },
  room: { type: String }
}, { timestamps: true });

export default mongoose.model<ITestResult>('TestResult', TestResultSchema);
