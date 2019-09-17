// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { userLogin: login, userRegister: register, userLogout: logOut } = createActions({
  [ActionTypes.USER_LOGIN]: (email, password) => ({
    email: email,
    password: password,
  }),
  [ActionTypes.USER_REGISTER]: (email, password, displayName) => ({
    email: email,
    password: password,
    displayName: displayName,
  }),
  [ActionTypes.USER_LOGOUT]: () => ({}),
});
