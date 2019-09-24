/**
 * @module Sagas/Projects
 * @desc Projects
 */

import { all, delay, put, takeLatest, select } from 'redux-saga/effects';
import { request } from 'modules/client';
import axios from 'axios';
import { ActionTypes } from 'constants/index';
import SelectInput from '@material-ui/core/Select/SelectInput';
import { setProjectOverviews } from '../actions';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import { push } from 'modules/history';

const arrowAxios = axios.create({
    baseURL: 'https://bzbee.herokuapp.com/',
    timeout: 2000,
});


/**
 * Get Repos
 *
 * @param {Object} action
 *
 */
export function* loadProjects() {
    const token = yield select((state) => state.user.token);
    var projects;
    yield arrowAxios
        .get('/projects', {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        .then(function (response) {
            projects = response.data
        })
        .catch(function (error) {
            var errorMsg = 'Unable to connect to server'
            if (error.response) {
                errorMsg = error.response.data.error;
            }
            toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
        });


    if (yield typeof projects != 'undefined') {
        yield put(setProjectOverviews(projects))
    }
}

export function* submitProject() {
    const token = yield select((state) => state.user.token);
    const project = yield select((state) => state.projects.createProject);
    var proj = cloneDeep(project)
    proj.milestones.forEach(milestone => {
        milestone.deadline = new Date(milestone.deadline).toISOString();
    })
    var success = false;
    yield arrowAxios
        .post('/projects', proj, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        .then(function (response) {
            success = true;
        })
        .catch(function (error) {
            var errorMsg = 'Unable to connect to server'
            if (error.response) {
                errorMsg = error.response.data.error;
            }
            toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
        });
    if (yield success) {
        push('/projects');
    }
}

/**
 * GitHub Sagas
 */
export default function* root() {
    yield all([takeLatest(ActionTypes.LOAD_PROJECTS, loadProjects),
    takeLatest(ActionTypes.SUBMIT_NEW_PROJECT, submitProject)]);
}
