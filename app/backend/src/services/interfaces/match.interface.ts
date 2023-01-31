export interface ScoreInterface {
  homeTeamGoals: number,
  awayTeamGoals: number,
}

export interface MatchInterface extends ScoreInterface {
  homeTeamId: number,
  awayTeamId: number,
}
