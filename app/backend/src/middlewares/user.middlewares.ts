import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http.exception';

export default (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpException(
      400,
      'All fields must be filled',
    );
  }

  next();
};
