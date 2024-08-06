import { User } from 'src/auth/schemas/user.schema';

export const isMemberInGroup = (members: User[], userId: string): boolean => {
  return members.some((member) => member.id === userId);
};
