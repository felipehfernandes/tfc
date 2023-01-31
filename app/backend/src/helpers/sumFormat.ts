import Match from '../database/models/Match.model';
import { propertiesTypes, teamHomeOrAwayTypes } from './types/properties.types';
import { sumInterface } from './interfaces/sum.interface';

export default class SumFormat implements sumInterface {
  private _homeOrAway: teamHomeOrAwayTypes;
  private _otherSide: teamHomeOrAwayTypes;
  private _properties: propertiesTypes[];

  constructor(url: string) {
    this._homeOrAway = url.includes('home') ? 'homeTeamGoals' : 'awayTeamGoals';
    this._otherSide = url.includes('home') ? 'awayTeamGoals' : 'homeTeamGoals';
    this._properties = ['totalPoints', 'totalGames', 'totalVictories', 'totalDraws',
      'totalLosses', 'goalsFavor', 'goalsOwn', 'goalsBalance', 'efficiency'];
  }

  get homeOrAway() { return this._homeOrAway; }
  get otherSide() { return this._otherSide; }
  get properties() { return this._properties; }

  private totalVictories(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => {
      if (curr[this.homeOrAway] > curr[this.otherSide]) {
        return acc + 1;
      }

      return acc;
    }, 0);
  }

  private totalLosses(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => {
      if (curr[this.homeOrAway] < curr[this.otherSide]) {
        return acc + 1;
      }

      return acc;
    }, 0);
  }

  private totalDraws(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => {
      if (curr[this.homeOrAway] === curr[this.otherSide]) {
        return acc + 1;
      }

      return acc;
    }, 0);
  }

  private totalPoints(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => {
      if (curr[this.homeOrAway] > curr[this.otherSide]) {
        return acc + 3;
      }

      if (curr[this.homeOrAway] === curr[this.otherSide]) {
        return acc + 1;
      }

      return acc;
    }, 0);
  }

  private goalsOwn(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => acc + curr[this.otherSide], 0);
  }

  private goalsFavor(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => acc + curr[this.homeOrAway], 0);
  }

  private goalsBalance(teamMatches:Match[]): number {
    return this.goalsFavor(teamMatches) - this.goalsOwn(teamMatches);
  }

  private totalGames = (teamMatches: Match[]): number => teamMatches.length;

  private efficiency(teamMatches:Match[]): string {
    return ((this.totalPoints(teamMatches) / (teamMatches.length * 3)) * 100).toFixed(2);
  }

  calculate(teamMatches: Match[], propertie: propertiesTypes): number | string {
    return this[propertie](teamMatches);
  }
}
