import * as bcrypt from 'bcrypt';
import { TransformedExpenseDto } from 'src/expense/dtos/transform-expense.dto';
import { Expense } from 'src/expense/expense.schema';
import { TransformedGroupDto } from 'src/group/dtos/transformed-group.dto';
import { Group } from 'src/group/group.schema';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

export const minTransfers = (expenses: Expense[]): number => {
  const balanceMap: { [key: string]: number } = {};

  for (const expense of expenses) {
    const { paidBy, paidOn, value } = expense;
    if (!balanceMap[paidBy.id]) balanceMap[paidBy.id] = 0;
    if (!balanceMap[paidOn.id]) balanceMap[paidOn.id] = 0;

    balanceMap[paidBy.id] -= Number(value);
    balanceMap[paidOn.id] += Number(value);
  }

  const balances = Object.values(balanceMap).filter((balance) => balance !== 0);

  const dfs = (balances: number[], start: number): number => {
    while (start < balances.length && balances[start] === 0) start++;

    if (start === balances.length) return 0;

    let minTrans = Number.MAX_VALUE;

    for (let i = start + 1; i < balances.length; i++) {
      if (balances[start] * balances[i] < 0) {
        balances[i] += balances[start];
        minTrans = Math.min(minTrans, 1 + dfs(balances, start + 1));
        balances[i] -= balances[start];
      }
    }

    return minTrans;
  };

  return dfs(balances, 0);
};

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
    paidOnId: expense.paidOn.id,
    createdAt: expense.createdAt,
  };
};
