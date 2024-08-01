import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { User } from 'src/auth/user.schema';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { GroupsRepository } from 'src/group/groups.repository';
import { UsersRepository } from 'src/auth/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserUniqueKey } from 'src/enums/user-unique-keys.enum';
import { TransformedExpenseDto } from './dtos/transform-expense.dto';
import { transformExpenseToDto } from 'src/utils/transform-to-dto.util';
import { UpdateExpenseDto } from './dtos/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpensesRepository)
    private readonly expensesRepository: ExpensesRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createExpense(
    user: User,
    createExpenseDto: CreateExpenseDto,
  ): Promise<TransformedExpenseDto> {
    const { groupId, paidById, paidOnId } = createExpenseDto;

    if (user.id !== paidById && user.id !== paidOnId) {
      throw new UnauthorizedException(
        'You can only create expenses for yourself.',
      );
    }

    const group = await this.groupsRepository.getGroupById(groupId);

    if (
      !group.members.some((member) => member.id === paidById) ||
      !group.members.some((member) => member.id === paidOnId)
    ) {
      throw new BadRequestException(
        'Both paidBy and paidOn users must be members of the group.',
      );
    }

    const paidByUser = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.ID,
      paidById,
    );

    const paidOnUser = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.ID,
      paidOnId,
    );

    const expense = await this.expensesRepository.createExpense(
      group,
      paidByUser,
      paidOnUser,
      createExpenseDto,
    );

    return transformExpenseToDto(expense);
  }

  async updateExpense(
    user: User,
    expenseId: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<TransformedExpenseDto> {
    const expense = await this.expensesRepository.getExpenseById(expenseId);

    if (expense.paidBy.id !== user.id && expense.paidOn.id !== user.id) {
      throw new UnauthorizedException(
        'You can only update expenses for yourself.',
      );
    }

    const updatedExpense = await this.expensesRepository.updateExpense(
      expense,
      updateExpenseDto,
    );

    return transformExpenseToDto(updatedExpense);
  }
}
