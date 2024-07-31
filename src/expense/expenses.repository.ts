import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Expense } from './expense.schema';
import { DataSource, Repository } from 'typeorm';
import { Group } from 'src/group/group.schema';
import { User } from 'src/auth/user.schema';
import { CreateExpenseDto } from './dtos/create-expense.dto';

@Injectable()
export class ExpensesRepository extends Repository<Expense> {
  constructor(dataSource: DataSource) {
    super(Expense, dataSource.createEntityManager());
  }

  async createExpense(
    group: Group,
    paidByUser: User,
    paidOnUser: User,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const expense = this.create({
      ...createExpenseDto,
      paidBy: paidByUser,
      paidOn: paidOnUser,
      group: group,
      createdAt: new Date().toISOString(),
    });

    try {
      return await this.save(expense);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
