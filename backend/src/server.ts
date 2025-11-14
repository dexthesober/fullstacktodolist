import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todos';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || '';
console.log("mongo_uri" , MONGO);

mongoose.connect("mongodb+srv://brajsharmabs_db_user:BKFWbpdWRSZYbEs7@cluster7.vapjiq8.mongodb.net/?appName=Cluster7")
  .then(() => {
    console.log('Mongo connected');
   
  })
  .catch((err) => {
    console.error('DB connection error', err);
  });

   app.listen(PORT, () => console.log(`Server started on ${PORT}`));
