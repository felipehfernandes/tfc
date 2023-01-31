import Match from '../../database/models/Match.model';
import { propertiesTypes, teamHomeOrAwayTypes } from '../types/properties.types';

export interface sumInterface {
  homeOrAway: teamHomeOrAwayTypes;
  otherSide: teamHomeOrAwayTypes;
  properties: propertiesTypes[];
  calculate(teamMatches: Match[], propertie: propertiesTypes): string | number;
}
