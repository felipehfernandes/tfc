import { ErrorRequestHandler } from 'express';

import httpException from '../exceptions/http.exception';

const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const { status, message } = error as httpException;
  res.status(status || 500).json({ message });
};

export default errorMiddleware;
