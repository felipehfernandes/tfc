import { Router } from 'express';

import UsersRouter from './User.route';

class Routes {
  public router: Router;
  public userRouter: UsersRouter;

  constructor() {
    this.router = Router();
    this.userRouter = new UsersRouter();

    this.router.use('/login', this.userRouter.router);
  }
}

export default Routes;
