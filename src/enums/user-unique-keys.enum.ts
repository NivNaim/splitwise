enum UserUniqueKeys {
  USERNAME = 'username',
  ID = 'id',
  EMAIL = 'email',
}

function isUserUniqueKey(key: any): key is UserUniqueKeys {
  return Object.values(UserUniqueKeys).includes(key);
}
