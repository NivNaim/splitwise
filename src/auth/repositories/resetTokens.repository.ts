import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { User } from '../schemas/user.schema';
import { ResetToken } from '../schemas/reset-token.schema';

@Injectable()
export class ResetTokenRepository extends Repository<ResetToken> {
  constructor(dataSource: DataSource) {
    super(ResetToken, dataSource.createEntityManager());
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
      const resetTokenSchema = await this.findOne({
        where: { token },
      });
      return resetTokenSchema;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteResetTokenById(id: string): Promise<void> {
    try {
      await this.delete({ id });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
