import { Router } from 'express';
import authMiddleware from '../middlewares/authentication.middleware';
import MatchController from '../controllers/Match.controller';
import matchMiddleware from '../middlewares/match.middleware';

export default class MatchRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/', MatchController.getAll);
    this.router.get('/?', MatchController.getByQuery);
    this.router.patch('/:id/finish', MatchController.endMatch);
    this.router.post('/', authMiddleware, matchMiddleware, MatchController.create);
    this.router.patch('/:id', authMiddleware, MatchController.updateScore);
  }
}
