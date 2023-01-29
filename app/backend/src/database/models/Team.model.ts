import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

import Match from './Match.model';

class Team extends Model {
  declare id: number;
  declare teamName: string;
}

Team.init({
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  teamName: {
    allowNull: false,
    type: STRING,
  },
}, {
  // ... Other configs
  sequelize: db,
  underscored: true,
  timestamps: false,
  modelName: 'Team',
  tableName: 'teams',
});

Match.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Match.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'awayTeam' });

Team.hasMany(Match, { foreignKey: 'id', as: 'matchId' });

export default Team;
