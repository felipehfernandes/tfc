import * as bcrypt from 'bcryptjs';

import HttpException from '../exceptions/http.exception';
import UserModel from '../database/models/User.model';
import { Login } from './interfaces/user.interface';
import { generateToken } from '../authentication/jwtFuncs';

class UserService {
  static async login(data: Login): Promise<string> {
    const { email, password } = data;

    const findUser = await UserModel.findOne({ where: { email } });

    // Check if user exists
    if (!findUser) {
      throw new HttpException(401, 'Incorrect email or password');
    }

    // Check if password is correct
    const checkPassword = bcrypt.compareSync(password, findUser.dataValues.password);
    if (!checkPassword) {
      throw new HttpException(401, 'Incorrect email or password');
    }
    const { password: _pass, ...userWithoutPassword } = findUser.dataValues;
    const token = generateToken(userWithoutPassword);
    return token;
  }
}

export default UserService;
