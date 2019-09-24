// @flow
/**
 * @module Actions/Projects
 * @desc Projects Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { loadProjects, setProjectOverviews, setNewProjectTitle, setNewProjectMilestoneName, setNewProjectMilestoneDeadline, addNewProjectMilestone, deleteNewProjectMilestone, addNewProjectMember, resetNewProject, submitNewProject } = createActions({
    [ActionTypes.LOAD_PROJECTS]: () => ({}),
    [ActionTypes.SET_PROJECTS_OVERVIEWS]: (projects) => ({ projects }),
    [ActionTypes.SET_NEW_PROJECT_TITLE]: (title) => ({ title }),
    [ActionTypes.SET_NEW_PROJECT_MILESTONE_NAME]: (index, name) => ({ index, name }),
    [ActionTypes.SET_NEW_PROJECT_MILESTONE_DEADLINE]: (index, deadline) => ({ index, deadline }),
    [ActionTypes.ADD_NEW_PROJECT_MILESTONE]: () => ({}),
    [ActionTypes.DELETE_NEW_PROJECT_MILESTONE]: (index) => ({ index }),
    [ActionTypes.ADD_NEW_PROJECT_MEMBER]: (name, email) => ({ name, email }),
    [ActionTypes.RESET_NEW_PROJECT]: () => ({}),
    [ActionTypes.SUBMIT_NEW_PROJECT]: () => ({}),
    [ActionTypes.DELETE_PROJECT]: (code) => ({ code }),
});
