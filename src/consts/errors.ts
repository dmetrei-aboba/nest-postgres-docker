export const USER_ERRORS = {
  USER_NOT_FOUND: { message: 'user.notFound', status: 404 },
  USER_ALREADY_EXIST: { message: 'user.alreadyExist', status: 409 },
};

export const AUTH_ERRORS = {
  AUTH_WRONG_CREDENTIALS: { message: 'auth.wrongCredentials', status: 403 },
  AUTH_WRONG_PASSWORD: { message: 'auth.wrongPassword', status: 403 },
  AUTH_NOT_AUTHORIZED: { message: 'auth.notAuthorized', status: 401 },
};
