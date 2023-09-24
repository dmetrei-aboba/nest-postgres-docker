import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './user.model';
import { SharedUserFields, USER_ERRORS } from 'consts';
import { CommonError } from 'common';
import { UniqueConstraintError } from 'sequelize';
import { omit, pick } from 'lodash';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getUserById(id: string) {
    const user = await this.userModel.findByPk(id, {
      attributes: SharedUserFields,
    });

    if (!user) throw new CommonError(USER_ERRORS.USER_NOT_FOUND);

    return user;
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async getUserByPhone(phone: string) {
    return this.userModel.findOne({ where: { phone } });
  }

  async createUser(data: {
    encryptedPassword: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) {
    return this.userModel.create(data).catch((err) => {
      if (err instanceof UniqueConstraintError) {
        throw new CommonError(USER_ERRORS.USER_ALREADY_EXIST);
      }
      throw new CommonError(err);
    });
  }

  async updateUser(data: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) {
    const res = await this.userModel
      .update(omit(data, 'id'), { where: { id: data.id }, returning: true })
      .catch((err) => {
        if (err instanceof UniqueConstraintError) {
          throw new CommonError(USER_ERRORS.USER_ALREADY_EXIST);
        }
        throw new CommonError(err);
      });

    if (res[0] === 0) throw new CommonError(USER_ERRORS.USER_NOT_FOUND);

    return pick(res[1][0], SharedUserFields);
  }

  async deleteUser(id: string) {
    const res = await this.userModel.destroy({ where: { id } });

    if (res === 0) throw new CommonError(USER_ERRORS.USER_NOT_FOUND);

    return;
  }

  async getUsers(data: any) {
    const { search, limit = 10, offset = 0 } = data;

    let where;

    if (search)
      where = {
        [Op.or]: {
          email: { [Op.iLike]: search },
          phone: { [Op.iLike]: search },
        },
      };

    const users = await this.userModel.findAll({
      attributes: SharedUserFields,
      where,
      limit,
      offset,
    });

    return users;
  }
}
