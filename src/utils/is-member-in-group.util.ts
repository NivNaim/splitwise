import { User } from 'src/auth/user.schema';

export const isMemberInGroup = (members: User[], userId: string): boolean => {
  return members.some((member) => member.id === userId);
};
