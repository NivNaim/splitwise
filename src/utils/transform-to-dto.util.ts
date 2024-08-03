import { TransformedExpenseDto } from 'src/expense/dtos/transform-expense.dto';
import { Expense } from 'src/expense/expense.schema';
import { TransformedGroupDto } from 'src/group/dtos/transformed-group.dto';
import { Group } from 'src/group/group.schema';

export const transformGroupToDto = (group: Group): TransformedGroupDto => {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    ownerId: group.owner.id,
    membersIds: group.members.map((member) => member.id),
  };
};

export const transformExpenseToDto = (
  expense: Expense,
): TransformedExpenseDto => {
  return {
    id: expense.id,
    cause: expense.cause,
    value: expense.value,
    group: expense.group,
    isPaid: expense.isPaid,
    paidById: expense.paidBy.id,
    receivedById: expense.receivedBy.id,
    createdAt: expense.createdAt,
  };
};
