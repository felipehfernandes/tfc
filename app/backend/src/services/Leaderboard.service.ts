import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';
import sorting from '../helpers/sortFormat';
import SumFormat from '../helpers/sumFormat';
import {
  databaseFormatInterface,
  leaderboardInterface,
  leaderboardInterfaceN,
} from './interfaces/leaderboard.interface';

export default class LeaderboardService {
  static matchInfo(
    matchesByTeam: Match[][],
    teams: Team[],
    url:string,
  ): leaderboardInterface[] {
    const sumFormat = new SumFormat(url);

    return matchesByTeam.map((team, index) => sumFormat.properties
      .reduce((acc, curr) => ({
        ...acc,
        name: teams[index].teamName,
        [curr]: sumFormat.calculate(team, curr),
      }), {} as leaderboardInterface));
  }

  static getInfoByTeam(url: string, teams: Team[], matches: Match[]): leaderboardInterface[] {
    const homeOrAway = url.includes('home') ? 'homeTeamId' : 'awayTeamId';
    const matchesByTeam = teams.map((team) => matches.filter((m) => m[homeOrAway] === team.id));

    return LeaderboardService.matchInfo(matchesByTeam, teams, url);
  }

  static sumAll(
    home:leaderboardInterfaceN[],
    away:leaderboardInterfaceN[],
  ): leaderboardInterfaceN[] {
    const keys = (Object.keys(home[0]) as (keyof leaderboardInterfaceN)[]);
    const totals = home
      .map((team, index) => keys
        .reduce((acc, curr) => ({
          ...acc,
          [curr]: team[curr] + away[index][curr],
        }), {} as leaderboardInterfaceN));

    return totals;
  }

  static async databaseSearch(): Promise<databaseFormatInterface> {
    const teams = await Team.findAll();
    const matches = await Match.findAll({ where: { inProgress: false } });

    return { teams, matches };
  }

  static async getAll(url: string): Promise<leaderboardInterface[]> {
    const { teams, matches } = await LeaderboardService.databaseSearch();
    const home = LeaderboardService.getInfoByTeam('home', teams, matches);
    const away = LeaderboardService.getInfoByTeam('away', teams, matches);

    if (url.includes('home')) {
      return sorting(home);
    }

    if (url.includes('away')) {
      return sorting(away);
    }

    const totals = LeaderboardService.sumAll(home, away);
    const data = totals.map((team, index) => ({
      ...team,
      name: home[index].name,
      goalsBalance: team.goalsFavor - team.goalsOwn,
      efficiency: ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2),
    }));

    return sorting(data);
  }
}
