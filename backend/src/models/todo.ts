import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date | null;
}

const TodoSchema = new Schema<ITodo>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, default: null }
}, { timestamps: true });

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
