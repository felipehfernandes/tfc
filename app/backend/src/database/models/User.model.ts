import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: string;
}

User.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: INTEGER,
  },
  username: {
    allowNull: false,
    type: STRING,
  },
  role: {
    allowNull: false,
    type: STRING,
  },
  email: {
    allowNull: false,
    type: STRING,
  },
  password: {
    allowNull: false,
    type: STRING,
  },
}, {
  // ... Other configs
  sequelize: db,
  underscored: true,
  timestamps: false,
  modelName: 'User',
  tableName: 'users',
});

export default User;
