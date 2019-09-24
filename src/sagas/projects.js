/**
 * @module Sagas/Projects
 * @desc Projects
 */

import { all, delay, put, takeLatest, select } from 'redux-saga/effects';
import { request } from 'modules/client';
import axios from 'axios';
import { ActionTypes } from 'constants/index';
import SelectInput from '@material-ui/core/Select/SelectInput';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import { push } from 'modules/history';
import { setProjectOverviews, setProject } from '../actions';

const arrowAxios = axios.create({
    baseURL: 'https://bzbee.herokuapp.com/',
    timeout: 2000,
});

function checkAuth(error) {

}
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
            console.log(error);
            var errorMsg = 'Unable to connect to server'
            if (error.response) {
                errorMsg = error.response.data.error;
            }
            toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
        });

    if (yield typeof projects != 'undefined') {
        yield projects.forEach(convertDates);
        yield put(setProjectOverviews(projects));
    }
}

export function* loadProject({ payload: { code } }) {
    const token = yield select((state) => state.user.token);
    var project;
    yield arrowAxios
        .get('/projects/' + code, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        .then(function (response) {
            project = response.data
        })
        .catch(function (error) {
            var errorMsg = 'Unable to connect to server'
            if (error.response) {
                errorMsg = error.response.data.error;
            }
            toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
        });

    if (yield typeof project != 'undefined') {
        yield convertDates(project);
        yield put(setProject(project));
    }
}

export function* submitProject() {
    const token = yield select((state) => state.user.token);
    const project = yield select((state) => state.projects.createProject);
    var proj = cloneDeep(project)
    proj.milestones.forEach(milestone => {
        milestone.date = new Date(milestone.date).toISOString();
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

export function* patchProject() {
    const token = yield select((state) => state.user.token);
    const project = yield select((state) => state.projects.createProject);
    var proj = cloneDeep(project)
    proj.milestones.forEach(milestone => {
        milestone.date = new Date(milestone.date).toISOString();
    })
    var success = false;
    yield arrowAxios
        .put('/projects/' + project.project.code, proj, {
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
        push('/project/' + project.project.code);
    }
}

export function* deleteProject({ payload: { code } }) {
    const token = yield select((state) => state.user.token);
    var success = false;
    yield arrowAxios
        .delete('/projects/' + code, {
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

function convertDates(obj) {
    if (!obj) {
        return;
    }
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
            convertDates(obj[key])
        } else if (key == 'date' || key == 'deadline') {
            obj[key] = new Date(obj[key])
        }
    })
}


/**
 * GitHub Sagas
 */
export default function* root() {
    yield all([takeLatest(ActionTypes.LOAD_PROJECTS, loadProjects),
    takeLatest(ActionTypes.SUBMIT_NEW_PROJECT, submitProject),
    takeLatest(ActionTypes.DELETE_PROJECT, deleteProject),
    takeLatest(ActionTypes.PATCH_PROJECT, patchProject),
    takeLatest(ActionTypes.LOAD_PROJECT, loadProject)]);
}
