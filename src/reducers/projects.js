import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { REHYDRATE } from 'redux-persist/lib/constants';

import { ActionTypes } from 'constants/index';

export const projectsState = {
    projects: [],
};

export default {
    projects: handleActions(
        {
            [ActionTypes.SET_PROJECTS]: (state, { payload: { projects } }) => {
                return immutable(state, {
                    projects: { $set: projects },
                });
            },
        },
        projectsState,
    ),
};
