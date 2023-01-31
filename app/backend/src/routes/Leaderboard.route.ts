import { Router } from 'express';

import LeaderboardController from '../controllers/Leaderboard.controller';

export default class LeaderboardRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/', LeaderboardController.getAll);
    this.router.get('/home', LeaderboardController.getAll);
    this.router.get('/away', LeaderboardController.getAll);
  }
}
