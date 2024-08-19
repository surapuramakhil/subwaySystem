import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

//Todo: global error handler is not working expected - Express issue
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