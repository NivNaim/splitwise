import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  async createRefreshToken(
    token: string,
    user: User,
    expires: Date,
  ): Promise<RefreshToken> {
    const refreshToken = this.create({
      token,
      user,
      expires,
    });

    try {
      return await this.save(refreshToken);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getRefreshTokenSchemaByToken(token: string): Promise<RefreshToken> {
    try {
      const refreshTokenSchema = await this.findOne({
        where: { token },
        relations: ['user'],
      });
      return refreshTokenSchema;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteRefreshTokenById(id: string): Promise<void> {
    try {
      await this.delete({ id });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
