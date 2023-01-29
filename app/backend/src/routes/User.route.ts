import { Router } from 'express';

import UserController from '../controllers/User.controller';
import userMiddleware from '../middlewares/user.middlewares';
import authenticationMiddleware from '../middlewares/authentication.middleware';

class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.post('/', userMiddleware, UserController.login);
    this.router.get('/validate', authenticationMiddleware, UserController.validate);
  }
}

export default UserRouter;
