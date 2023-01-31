import { Router } from 'express';

import UsersRouter from './User.route';
import TeamsRouter from './Team.route';
import MatchesRouter from './Match.route';

class Routes {
  public router: Router;
  public userRouter: UsersRouter;
  public teamRouter: TeamsRouter;
  public matchRouter: MatchesRouter;

  constructor() {
    this.router = Router();
    this.userRouter = new UsersRouter();
    this.teamRouter = new TeamsRouter();
    this.matchRouter = new MatchesRouter();

    this.router.use('/login', this.userRouter.router);
    this.router.use('/teams', this.teamRouter.router);
    this.router.use('/matches', this.matchRouter.router);
  }
}

export default Routes;
