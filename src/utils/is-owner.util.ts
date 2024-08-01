export const isOwner = (userId: string, ownerId: string): boolean => {
  return userId === ownerId;
};
