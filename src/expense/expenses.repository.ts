import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Expense } from './expense.schema';
import { DataSource, Repository } from 'typeorm';
import { Group } from 'src/group/group.schema';
import { User } from 'src/auth/user.schema';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';

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
      group,
      createdAt: new Date().toISOString(),
    });

    try {
      return await this.save(expense);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getExpenseById(id: string): Promise<Expense> {
    let expense: Expense;
    try {
      expense = await this.findOne({
        where: { id },
        relations: ['paidBy', 'paidOn', 'group'],
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!expense) {
      throw new NotFoundException(`Expense with ID "${id}" not found`);
    }

    return expense;
  }

  async updateExpense(
    expense: Expense,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    Object.assign(expense, updateExpenseDto);

    try {
      return await this.save(expense);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
