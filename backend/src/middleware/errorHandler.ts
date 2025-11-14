import { Request, Response, NextFunction } from 'express';
import { Log } from '../models/log';

export async function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  try {
    await Log.create({
      message: err.message || 'Server error',
      stack: err.stack,
      route: req.originalUrl,
      method: req.method
    });
  } catch (e) {
    console.error('Failed to write log', e);
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
}
