import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { REHYDRATE } from 'redux-persist/lib/constants';
import { cloneDeep } from 'lodash';

import { ActionTypes } from 'constants/index';
import { convertDates, convertDatesToString } from '../modules/helpers';
import { grey } from '@material-ui/core/colors';

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
    editTask: {
        title: "",
        description: " ",
        color: grey[500],
        deadline: new Date().toISOString().substring(0, 10),
        completed: false,
        assignees: [
        ],
        milestones: [
        ],
        subtasks: [],
        deletedSubtasks: [],
    },
    editSubTask: {
        title: "",
        description: " ",
        deadline: new Date().toISOString().substring(0, 10),
        completed: false,
        assignees: [
        ],
    }
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
            [ActionTypes.RESET_EDIT_TASK]: (state) => {
                return immutable(state, {
                    editTask: {
                        $set: {
                            title: "",
                            description: " ",
                            color: grey[500],
                            deadline: new Date().toISOString().substring(0, 10),
                            completed: false,
                            assignees: [
                            ],
                            milestones: [
                            ],
                            deletedSubtasks: [],
                            subtasks: []
                        }
                    }
                });
            },
            [ActionTypes.RESET_EDIT_SUB_TASK]: (state) => {
                return immutable(state, {
                    editSubTask: {
                        $set: {
                            title: "",
                            description: " ",
                            deadline: new Date().toISOString().substring(0, 10),
                            completed: false,
                            assignees: [
                            ],
                        }
                    }
                });
            },
            [ActionTypes.SET_TASK_COLOR]: (state, { payload: { color } }) => {
                return immutable(state, {
                    editTask: {
                        color: {
                            $set: color
                        }
                    },
                });
            },
            [ActionTypes.SET_TASK_TITLE]: (state, { payload: { title } }) => {
                return immutable(state, {
                    editTask: {
                        title: {
                            $set: title
                        }
                    },
                });
            },
            [ActionTypes.SET_TASK_DESCRIPTION]: (state, { payload: { description } }) => {
                return immutable(state, {
                    editTask: {
                        description: {
                            $set: description
                        }
                    },
                });
            },
            [ActionTypes.SET_TASK_DEADLINE]: (state, { payload: { deadline } }) => {
                return immutable(state, {
                    editTask: {
                        deadline: {
                            $set: deadline
                        }
                    },
                });
            },
            [ActionTypes.ADD_SUB_TASK]: (state) => {
                return immutable(state, {
                    editTask: {
                        subtasks: {
                            $push: [{
                                title: "",
                                description: " ",
                                deadline: new Date().toISOString().substring(0, 10),
                                completed: false,
                                assignees: [
                                ],
                            }]
                        }
                    }
                });
            },
            [ActionTypes.LOAD_TASK_FOR_EDIT]: (state, { payload: { code, taskid } }) => {
                const task = state.projects[code].tasks.find(task => task.id == taskid)
                return immutable(state, {
                    editTask: {
                        $set: convertDatesToString(cloneDeep(task)),
                    },
                });
            },
            [ActionTypes.LOAD_SUB_TASK_FOR_EDIT]: (state, { payload: { code, taskid, subtaskid } }) => {
                const subtask = state.projects[code].tasks.find(task => task.id == taskid).subtasks.find(subtask => subtask.id == subtaskid)
                return immutable(state, {
                    editSubTask: {
                        $set: convertDatesToString(cloneDeep(subtask)),
                    },
                });
            },
            [ActionTypes.SET_TASK_ASSIGNEES]: (state, { payload: { assignees } }) => {
                return immutable(state, {
                    editTask: {
                        assignees: {
                            $set: assignees,
                        }
                    },
                });
            },
            [ActionTypes.SET_TASK_MILESTONES]: (state, { payload: { milestones } }) => {
                return immutable(state, {
                    editTask: {
                        milestones: {
                            $set: milestones,
                        }
                    },
                });
            },
            [ActionTypes.SET_SUB_TASK_DESCRIPTION]: (state, { payload: { index, description } }) => {
                if (typeof index == 'undefined') {
                    return immutable(state, {
                        editSubTask: {
                            description: {
                                $set: description,
                            }
                        },
                    });
                } else {
                    return immutable(state, {
                        editTask: {
                            subtasks: {
                                [index]: {
                                    description: {
                                        $set: description,
                                    }
                                }
                            }
                        },
                    });
                }
            },
            [ActionTypes.SET_SUB_TASK_TITLE]: (state, { payload: { index, title } }) => {
                if (typeof index == 'undefined') {
                    return immutable(state, {
                        editSubTask: {
                            title: {
                                $set: title,
                            }
                        },
                    });
                } else {
                    return immutable(state, {
                        editTask: {
                            subtasks: {
                                [index]: {
                                    title: {
                                        $set: title,
                                    }
                                }
                            }
                        },
                    });
                }
            },
            [ActionTypes.SET_SUB_TASK_DEADLINE]: (state, { payload: { index, deadline } }) => {
                if (typeof index == 'undefined') {
                    return immutable(state, {
                        editSubTask: {
                            deadline: {
                                $set: deadline,
                            }
                        },
                    });
                } else {
                    return immutable(state, {
                        editTask: {
                            subtasks: {
                                [index]: {
                                    deadline: {
                                        $set: deadline,
                                    }
                                }
                            }
                        },
                    });
                }
            },
            [ActionTypes.SET_SUB_TASK_ASSIGNEES]: (state, { payload: { index, assignees } }) => {
                if (typeof index == 'undefined') {
                    return immutable(state, {
                        editSubTask: {
                            assignees: {
                                $set: assignees,
                            }
                        },
                    });
                } else {
                    return immutable(state, {
                        editTask: {
                            subtasks: {
                                [index]: {
                                    assignees: {
                                        $set: assignees,
                                    }
                                }
                            }
                        },
                    });
                }
            },
            [ActionTypes.DELETE_SUB_TASK]: (state, { payload: { index } }) => {
                const mod = {
                    editTask: {
                        subtasks: {
                            $splice: [[index, 1]]
                        },
                    },
                }
                const taskId = state.editTask.subtasks[index].id;
                if (taskId) {
                    mod.editTask.deletedSubtasks = {
                        $push: taskId,
                    }
                }
                return immutable(state, mod);
            },
        },
        projectsState,
    ),
};
