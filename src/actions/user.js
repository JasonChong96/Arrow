// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const {
  userLogin: login,
  userRegister: register,
  userLogout: logOut,
  setUserInfo,
} = createActions({
  [ActionTypes.USER_LOGIN]: (email, password) => ({
    email,
    password,
  }),
  [ActionTypes.USER_REGISTER]: (email, password, displayName) => ({
    email,
    password,
    displayName,
  }),
  [ActionTypes.SET_USER_INFO]: (token, email, displayName) => ({
    email,
    token,
    displayName,
  }),
  [ActionTypes.USER_LOGOUT]: () => ({}),
});
