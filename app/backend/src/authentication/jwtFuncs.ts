import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import { tokenForUser } from './interfaces/jwt.interface';

dotenv.config();

const secret = process.env.JWT_SECRET || 'yourSecretHere';

const generateToken = (userWithoutPassword: tokenForUser) => {
  const token = jwt.sign({ data: userWithoutPassword }, secret, {
    algorithm: 'HS256',
    expiresIn: '1d',
  });
  return token;
};

const verifyToken = (authorization: string) => {
  try {
    const payload = jwt.verify(authorization, secret);
    return payload;
  } catch (error) {
    return { isError: true };
  }
};

export {
  generateToken,
  verifyToken,
};
