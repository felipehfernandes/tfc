import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import HttpException from '../exceptions/http.exception';

dotenv.config();

const secret = process.env.JWT_SECRET || 'yourSecretHere';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    throw new HttpException(401, 'Token must be a valid token');
  }

  // Check if token is valid
  try {
    const decoded = jwt.verify(token, secret);
    req.body.decoded = decoded;
    return next();
  } catch (error) {
    throw new HttpException(401, 'Token must be a valid token');
  }
};
