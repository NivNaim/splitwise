import { Expense } from 'src/expense/expense.schema';

export const minTransfers = (expenses: Expense[]): number => {
  const balanceMap: { [key: string]: number } = {};

  for (const expense of expenses) {
    const { paidBy, receivedBy, value } = expense;
    if (!balanceMap[paidBy.id]) balanceMap[paidBy.id] = 0;
    if (!balanceMap[receivedBy.id]) balanceMap[receivedBy.id] = 0;

    balanceMap[paidBy.id] -= Number(value);
    balanceMap[receivedBy.id] += Number(value);
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
