export const isUserInvolvedInExpense = (
  userId: string,
  paidById: string,
  receivedById: string,
): boolean => {
  return userId === paidById && userId !== receivedById;
};
