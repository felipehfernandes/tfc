import { Router } from 'express';

import UsersRouter from './User.route';
import TeamsRouter from './Team.route';

class Routes {
  public router: Router;
  public userRouter: UsersRouter;
  public teamRouter: TeamsRouter;

  constructor() {
    this.router = Router();
    this.userRouter = new UsersRouter();
    this.teamRouter = new TeamsRouter();

    this.router.use('/login', this.userRouter.router);
    this.router.use('/teams', this.teamRouter.router);
  }
}

export default Routes;
