// @flow
/**
 * @module Actions/Projects
 * @desc Projects Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { loadProjects, setProjects } = createActions({
    [ActionTypes.LOAD_PROJECTS]: () => ({}),
    [ActionTypes.SET_PROJECTS]: (projects) => ({ projects })
});
