import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { User } from '../schemas/user.schema';
import { ResetToken } from '../schemas/reset-token.schema';

@Injectable()
export class ResetTokenRepository extends Repository<ResetToken> {
  constructor(dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  async createResetTokenSchema(
    token: string,
    user: User,
    expires: Date,
  ): Promise<RefreshToken> {
    const resetTokenSchema = this.create({
      token,
      user,
      expires,
    });

    try {
      return await this.save(resetTokenSchema);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getResetTokenSchemaByToken(token: string): Promise<ResetToken> {
    try {
      const refreshTokenSchema = await this.findOne({
        where: { token },
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
