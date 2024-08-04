import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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
import { isMemberInGroup } from 'src/utils/is-member-in-group.util';
import { isUserInvolvedInExpense } from 'src/utils/is-user-involved-in-expense.util';
import { isOwner } from 'src/utils/is-owner.util';

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
    const { groupId, paidById, receivedById } = createExpenseDto;

    if (!isUserInvolvedInExpense(user.id, paidById, receivedById)) {
      throw new UnauthorizedException(
        'You can only create expenses for yourself.',
      );
    }

    const group = await this.groupsRepository.getGroupById(groupId);

    if (
      !isMemberInGroup(group.members, paidById) ||
      !isMemberInGroup(group.members, receivedById)
    ) {
      throw new BadRequestException(
        'Both paidBy and receivedBy users must be members of the group.',
      );
    }

    const paidByUser = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.ID,
      paidById,
    );

    const receivedByUser = await this.usersRepository.getUserByUniqueKey(
      UserUniqueKey.ID,
      receivedById,
    );

    const expense = await this.expensesRepository.createExpense(
      group,
      paidByUser,
      receivedByUser,
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

    if (
      !isUserInvolvedInExpense(
        user.id,
        expense.paidBy.id,
        expense.receivedBy.id,
      )
    ) {
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

  async deleteExpense(user: User, expenseId: string): Promise<void> {
    const expense = await this.expensesRepository.getExpenseById(expenseId);

    const groupId = expense.group.id;
    const group = await this.groupsRepository.getGroupById(groupId);

    if (!isOwner(user.id, group.owner.id)) {
      throw new ForbiddenException(
        'Only the owner can delete expense from the group.',
      );
    }

    await this.expensesRepository.deleteExpenseById(expenseId);
  }
}
