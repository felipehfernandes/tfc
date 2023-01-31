import Match from '../../database/models/Match.model';
import Team from '../../database/models/Team.model';

export interface leaderboardInterfaceN {
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}

export interface leaderboardInterfaceI extends leaderboardInterfaceN {
  name: string;

}

export interface leaderboardInterface extends leaderboardInterfaceI {
  goalsBalance: number;
  efficiency: string;
}

export interface databaseFormatInterface {
  teams: Team[],
  matches: Match[],
}
