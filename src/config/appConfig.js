const appConfig = {
  loginIdentifier: 'email',

  auth: {
    // keys in the login/refresh success response
    accessTokenKey:  'accessToken',
    refreshTokenKey: 'refreshToken',
    idTokenKey:      'idToken',
    tokenTypeKey:    'tokenType',
    expiresInKey:    'expiresIn',
    userKey:         'user',

    // key in error responses
    messageKey: 'message',

    // challenge values
    challengeNewPassword: 'NEW_PASSWORD_REQUIRED',
  },
}

export default appConfig