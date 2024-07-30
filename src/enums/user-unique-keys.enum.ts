export enum UserUniqueKey {
  USERNAME = 'username',
  ID = 'id',
  EMAIL = 'email',
}

export const isUserUniqueKey = (key: any): key is UserUniqueKey => {
  return Object.values(UserUniqueKey).includes(key);
};
