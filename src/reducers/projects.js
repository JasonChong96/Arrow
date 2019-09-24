import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { REHYDRATE } from 'redux-persist/lib/constants';
import { cloneDeep } from 'lodash';

import { ActionTypes } from 'constants/index';

const blankProject = {}

export const projectsState = {
    projectOverviews: [],
    createProject: {
        project: {
            title: '',
        },
        milestones: [],
        members: [],
    },
    projects: {},
};

export default {
    projects: handleActions(
        {
            [ActionTypes.SET_PROJECT_OVERVIEWS]: (state, { payload: { projects } }) => {
                return immutable(state, {
                    projectOverviews: { $set: projects },
                });
            },
            [ActionTypes.SET_NEW_PROJECT_TITLE]: (state, { payload: { title } }) => {
                return immutable(state, {
                    createProject: {
                        project: {
                            title: {
                                $set: title
                            }
                        }
                    },
                });
            },
            [ActionTypes.ADD_NEW_PROJECT_MILESTONE]: (state) => {
                return immutable(state, {
                    createProject: {
                        milestones: {
                            $push: [{
                                name: '',
                                date: new Date().toISOString().substring(0, 10),
                            }]
                        }
                    },
                });
            },
            [ActionTypes.DELETE_NEW_PROJECT_MILESTONE]: (state, { payload: { index } }) => {
                return immutable(state, {
                    createProject: {
                        milestones: {
                            $splice: [[index, 1]]
                        }
                    },
                });
            },
            [ActionTypes.SET_NEW_PROJECT_MILESTONE_NAME]: (state, { payload: { index, name } }) => {
                return immutable(state, {
                    createProject: {
                        milestones: {
                            [index]: {
                                name: {
                                    $set: name,
                                },
                            },
                        },
                    },
                });
            },
            [ActionTypes.SET_NEW_PROJECT_MILESTONE_DEADLINE]: (state, { payload: { index, deadline } }) => {
                return immutable(state, {
                    createProject: {
                        milestones: {
                            [index]: {
                                date: {
                                    $set: deadline,
                                },
                            },
                        },
                    },
                });
            },
            [ActionTypes.ADD_NEW_PROJECT_MEMBER]: (state, { payload: { name, email } }) => {
                return immutable(state, {
                    createProject: {
                        members: {
                            $push: [{
                                name,
                                email
                            }]
                        }
                    },
                });
            },
            [ActionTypes.RESET_NEW_PROJECT]: (state) => {
                return immutable(state, {
                    createProject: {
                        $set: {
                            project: {
                                title: '',
                            },
                            milestones: [],
                            members: [],
                        }
                    },
                });
            },
            [ActionTypes.LOAD_PROJECT_FOR_EDIT]: (state, { payload: { code } }) => {
                var projectInfo = state.projects[code];
                return immutable(state, {
                    createProject: {
                        $set: cloneDeep({
                            project: projectInfo.project,
                            milestones: projectInfo.milestones.map(milestone => ({
                                name: milestone.name,
                                date: milestone.date.toISOString().substring(0, 10),
                                id: milestone.id,
                            })),
                            members: projectInfo.members,
                        })
                    },
                });
            },
            [ActionTypes.SET_PROJECT]: (state, { payload: { project } }) => {
                return immutable(state, {
                    projects: {
                        [project.project.code]: {
                            $set: project
                        }
                    },
                });
            },
        },
        projectsState,
    ),
};
