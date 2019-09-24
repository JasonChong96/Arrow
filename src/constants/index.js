import keyMirror from 'fbjs/lib/keyMirror';

/**
 * @namespace Constants
 * @desc App constants
 */

/**
 * @constant {Object} ActionTypes
 * @memberof Constants
 */
export const ActionTypes = keyMirror({
  SWITCH_MENU: undefined,
  EXCEPTION: undefined,
  USER_REGISTER: undefined,
  USER_LOGIN: undefined,
  USER_LOGIN_WITH_CREDENTIALS: undefined,
  USER_LOGIN_SUCCESS: undefined,
  USER_LOGIN_FAILURE: undefined,
  USER_LOGOUT: undefined,
  USER_LOGOUT_SUCCESS: undefined,
  USER_LOGOUT_FAILURE: undefined,
  SET_USER_INFO: undefined,
  GITHUB_GET_REPOS: undefined,
  GITHUB_GET_REPOS_SUCCESS: undefined,
  GITHUB_GET_REPOS_FAILURE: undefined,
  SHOW_ALERT: undefined,
  HIDE_ALERT: undefined,
  LOAD_PROJECTS: undefined,
  SET_PROJECT_OVERVIEWS: undefined,
  SET_NEW_PROJECT_TITLE: undefined,
  SET_NEW_PROJECT_MILESTONE_NAME: undefined,
  SET_NEW_PROJECT_MILESTONE_DEADLINE: undefined,
  ADD_NEW_PROJECT_MILESTONE: undefined,
  DELETE_NEW_PROJECT_MILESTONE: undefined,
  ADD_NEW_PROJECT_MEMBER: undefined,
  RESET_NEW_PROJECT: undefined,
  SUBMIT_NEW_PROJECT: undefined,
  DELETE_PROJECT: undefined,
  LOAD_PROJECT_FOR_EDIT: undefined,
  LOAD_PROJECT: undefined,
  SET_PROJECT: undefined,
  PATCH_PROJECT: undefined,
});

/**
 * @constant {Object} STATUS
 * @memberof Constants
 */
export const STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  READY: 'ready',
  SUCCESS: 'success',
  ERROR: 'error',
};
