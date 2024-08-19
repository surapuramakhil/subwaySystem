import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

// This is Required to handle async errors in express (Express doesn't handle async errors by default)
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

  console.error('Unhandled error:', err);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });

};