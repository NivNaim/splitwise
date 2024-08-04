export const calculateBalances = (balances: number[]): number => {
  return balances.reduce((acc, balance) => acc + balance, 0);
};
