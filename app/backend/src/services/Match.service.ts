import HttpException from '../exceptions/http.exception';
import Team from '../database/models/Team.model';
import Match from '../database/models/Match.model';
import { MatchInterface, ScoreInterface } from './interfaces/match.interface';

export default class MatchService {
  static async getAll(): Promise<Match[]> {
    const matches = await Match.findAll({
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
        {
          model: Team,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return matches;
  }

  static async getByQuery(query: string): Promise<Match[]> {
    const inProgress = query === 'true';
    const matches = await Match.findAll({
      where: { inProgress },
      include: [
        { model: Team,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
        { model: Team,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return matches;
  }

  static async endMatch(id: number): Promise<string> {
    const [newUp] = await Match.update(
      { inProgress: false },
      { where: { id } },
    );

    if (newUp === 0) {
      throw new HttpException(400, 'Match does not exist');
    }

    return 'Finished';
  }

  static async create(data: MatchInterface): Promise<Match> {
    const { awayTeamId, homeTeamId } = data;
    const homeTeam = await Match.findByPk(homeTeamId);
    const awayTeam = await Match.findByPk(awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new HttpException(404, 'There is no team with such id!');
    }

    const result = await Match.create({
      ...data,
      inProgress: true,
    });

    return result;
  }

  static async updateScore(id:number, data: ScoreInterface): Promise<ScoreInterface> {
    const [newUp] = await Match.update(
      { ...data },
      { where: { id } },
    );

    if (newUp === 0) {
      throw new HttpException(400, 'Match does not exist');
    }

    return data;
  }
}
