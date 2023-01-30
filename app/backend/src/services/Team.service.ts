import HttpException from '../exceptions/http.exception';
import TeamModel from '../database/models/Team.model';

class TeamService {
  static async getAll(): Promise<TeamModel[]> {
    const teams = await TeamModel.findAll();
    return teams;
  }

  static async getById(id: number): Promise<TeamModel> {
    const team = await TeamModel.findByPk(id);

    if (!team) {
      throw new HttpException(
        400,
        'Team not found',
      );
    }

    return team;
  }
}

export default TeamService;
