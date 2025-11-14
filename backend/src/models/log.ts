import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  message: string;
  stack?: string;
  route?: string;
  method?: string;
}

const LogSchema = new Schema<ILog>({
  message: String,
  stack: String,
  route: String,
  method: String
}, { timestamps: true });

export const Log = mongoose.model<ILog>('Log', LogSchema);
