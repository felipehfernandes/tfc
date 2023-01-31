import { Request, Response } from 'express';

import MatchService from '../services/Match.service';

export default class MatchController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    if (req.query.inProgress) {
      return MatchController.getByQuery(req, res);
    }

    const allMatches = await MatchService.getAll();

    return res.status(200).json(allMatches);
  }

  static async getByQuery(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    const inProgMatches = await MatchService.getByQuery(inProgress as string);

    return res.status(200).json(inProgMatches);
  }

  static async endMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const message = await MatchService.endMatch(Number(id));

    return res.status(200).json({ message });
  }

  static async create(req: Request, res: Response): Promise<Response> {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    const data = {
      homeTeamId: Number(homeTeamId),
      awayTeamId: Number(awayTeamId),
      homeTeamGoals: Number(homeTeamGoals),
      awayTeamGoals: Number(awayTeamGoals),
    };
    const createMatch = await MatchService.create(data);

    return res.status(201).json(createMatch);
  }

  static async updateScore(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = await MatchService.updateScore(Number(id), req.body);

    return res.status(200).json(data);
  }
}
