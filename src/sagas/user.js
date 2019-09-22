/**
 * @module Sagas/User
 * @desc User
 */

import { all, delay, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { ActionTypes } from 'constants/index';
import { toast } from 'react-toastify';
import { channel } from 'redux-saga';
import { setUserInfo } from '../actions';

const authAxios = axios.create({
  baseURL: 'https://bzbee.herokuapp.com/',
  timeout: 2000,
});

/**
 * Login
 */
export function* login({ payload }) {
  const { email, password } = payload;
  var token = '';
  var realEmail = '';
  var displayName = '';
  yield authAxios
    .post('/login', {
      email: email,
      password: password,
    })
    .then(function (response) {
      token = response.data.jwt;
      displayName = response.data.name;
      realEmail = response.data.email;
    })
    .catch(function (error) {
      localStorage.removeItem('user');
      var errorMsg = 'Unable to connect to server'
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (yield token) {
    // TODO: TEMPORARY UNTIL BACKEND IS UPDATED
    realEmail = 'twmtdw@gmail.com'
    displayName = 'TW MTDW'
    yield put(setUserInfo(token, realEmail, displayName));
    yield put({
      type: ActionTypes.USER_LOGIN_SUCCESS,
    });
  } else {
    yield put({
      type: ActionTypes.USER_LOGIN_FAILURE,
    });
  }
}

export function* register({ payload }) {
  const { email, password, displayName } = payload;
  var token = "";
  var realEmail = "";
  var name = "";
  yield authAxios
    .post('/signup', {
      email: email,
      password: password,
      name: displayName,
    })
    .then(function (response) {
      token = response.data.jwt;
      name = response.data.name;
      realEmail = response.data.email;
    })
    .catch(function (error) {
      toast.error(error.response.data.error, { position: toast.POSITION.TOP_RIGHT });
    });
  if (yield token) {
    yield put(setUserInfo(token, realEmail, name));
    yield put({
      type: ActionTypes.USER_LOGIN_SUCCESS,
    });
  }
}

// axios.interceptors.response.use(
//   function (response) {
//     // If the request succeeds, we don't have to do anything and just return the response
//     return response
//   },
//   function (error) {
//     const errorResponse = error.response
//     if (isTokenExpiredError(errorResponse)) {
//       return resetTokenAndReattemptRequest(error)
//     }
//     // If the error is due to other reasons, we just throw it back to axios
//     return Promise.reject(error)
//   }
// )

// // This is the list of waiting requests that will retry after the JWT refresh complete
// let subscribers = [];

// function resetTokenAndReattemptRequest(error) {
//   try {
//     const { response: errorResponse } = error;
//     const resetToken = res.data.refreshToken; // Your own mechanism to get the refresh token to refresh the JWT token
//     if (!resetToken) {
//       // We can't refresh, throw the error anyway
//       return Promise.reject(error);
//     }
//     /* Proceed to the token refresh procedure
//     We create a new Promise that will retry the request,
//     clone all the request configuration from the failed
//     request in the error object. */
//     const retryOriginalRequest = new Promise(resolve => {
//       /* We need to add the request retry to the queue
//       since there another request that already attempt to
//       refresh the token */
//       addSubscriber(access_token => {
//         errorResponse.config.headers.Authorization = 'Bearer ' + access_token;
//         resolve(axios(errorResponse.config));
//       });
//     });
//     if (!isAlreadyFetchingAccessToken) {
//       isAlreadyFetchingAccessToken = true;
//       const response = axios({
//         method: 'post',
//         url: `<YOUR TOKEN REFREH ENDPOINT>`,
//         data: {
//           token: resetToken // Just an example, your case may vary
//         }
//       });
//       if (!response.data) {
//         return Promise.reject(error);
//       }
//       const newToken = response.data.token;
//       localStorage.setItem('user', newToken); // save the newly refreshed token for other requests to use
//       isAlreadyFetchingAccessToken = false;
//       onAccessTokenFetched(newToken);
//     }
//     return retryOriginalRequest;
//   } catch (err) {
//     return Promise.reject(err);
//   }
// }

// function onAccessTokenFetched(access_token) {
//   // When the refresh is successful, we start retrying the requests one by one and empty the queue
//   subscribers.forEach(callback => callback(access_token));
//   subscribers = [];
// }

// function addSubscriber(callback) {
//   subscribers.push(callback);
// }

// function isTokenExpiredError(errorResponse) {
//   // Your own logic to determine if the error is due to JWT token expired returns a boolean value
//   return true;
// }
/**
 * Logout
 */
export function* logout() {
  try {
    yield delay(200);
    yield localStorage.removeItem('user');
    yield put({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGOUT_FAILURE,
      payload: err,
    });
  }
}

/**
 * User Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.USER_LOGIN, login),
    takeLatest(ActionTypes.USER_LOGOUT, logout),
    takeLatest(ActionTypes.USER_REGISTER, register),
  ]);
}
