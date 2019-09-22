/**
 * @module Sagas/Projects
 * @desc Projects
 */

import { all, delay, put, takeLatest } from 'redux-saga/effects';
import { request } from 'modules/client';

import { ActionTypes } from 'constants/index';
import SelectInput from '@material-ui/core/Select/SelectInput';
import { setProjects } from '../actions';

/**
 * Get Repos
 *
 * @param {Object} action
 *
 */
export function* loadProjects() {
    yield delay(1000);

    yield put(setProjects([
        {
            "project": {
                "code": "G0pQi7",
                "title": "CS3216 Assignment 3",
                "deadline": "2019-12-25T00:00:00.207Z"
            },
            "upcoming_milestone": {
                "name": "Final week",
                "deadline": "2019-12-25T00:00:00.207Z"
            },
            "personal_todos": 7,
            "team_todos": 21,
            "personal_overdue": false,
            "team_overdue": false
        },
        {
            "project": {
                "code": "G0pQi8",
                "title": "FakeProject",
                "deadline": "2019-12-25T00:00:00.207Z"
            },
            "upcoming_milestone": {
                "name": "Draft 20",
                "deadline": "2019-12-24T00:00:00.207Z"
            },
            "personal_todos": 7,
            "team_todos": 21,
            "personal_overdue": true,
            "team_overdue": true,
        },
    ]));
}

/**
 * GitHub Sagas
 */
export default function* root() {
    yield all([takeLatest(ActionTypes.LOAD_PROJECTS, loadProjects)]);
}
