// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { userLogin: login, userRegister: register, userLogout: logOut, setUserInfo: setUserInfo } = createActions({
  [ActionTypes.USER_LOGIN]: (email, password) => ({
    email: email,
    password: password,
  }),
  [ActionTypes.USER_REGISTER]: (email, password, displayName) => ({
    email: email,
    password: password,
    displayName: displayName,
  }),
  [ActionTypes.SET_USER_INFO]: (token, email, displayName) => ({
    email: email,
    token: token,
    displayName: displayName,
  }),
  [ActionTypes.USER_LOGOUT]: () => ({}),
});
