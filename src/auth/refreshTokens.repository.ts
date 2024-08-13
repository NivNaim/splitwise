import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { DataSource, Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.schema';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  async createRefreshTokenSchema(
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
