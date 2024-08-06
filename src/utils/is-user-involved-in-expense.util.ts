export const isUserInvolvedInExpense = (
  userId: string,
  paidById: string,
  paidOnId: string,
): boolean => {
  return userId === paidById || userId === paidOnId;
};
