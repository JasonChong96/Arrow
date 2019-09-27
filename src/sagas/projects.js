/**
 * @module Sagas/Projects
 * @desc Projects
 */

import { all, delay, put, takeLatest, select } from 'redux-saga/effects';
import { request } from 'modules/client';
import { convertDates } from 'modules/helpers';
import axios from 'axios';
import { ActionTypes } from 'constants/index';
import SelectInput from '@material-ui/core/Select/SelectInput';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import { push } from 'modules/history';
import {
  setProjectOverviews,
  setProject,
  setPendingJoin,
  loadProject as loadProjectAction,
} from '../actions';

const arrowAxios = axios.create({
  baseURL: 'https://bzbee.herokuapp.com/',
  timeout: 2000,
});

function* checkAuth(response) {
  if (response.status == 401) {
    yield put({
      type: ActionTypes.USER_LOGOUT,
    });
    yield put(setProjectOverviews([]));
  }
}

export function* loadProjects({ payload: { reloadCache } }) {
  const token = yield select(state => state.user.token);
  let projects;
  let errorResponse;
  yield arrowAxios
    .get('/projects', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      projects = response.data;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorResponse = error.response;
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (errorResponse) {
    yield checkAuth(errorResponse);
  }
  if (yield typeof projects !== 'undefined') {
    yield projects.forEach(convertDates);
    yield put(setProjectOverviews(projects));
    if (reloadCache) {
      for (let i = 0; i < projects.length; i++) {
        yield loadProject({ payload: { code: projects[i].project.code } });
      }
    }
  }
}

export function* loadProject({ payload: { code } }) {
  const token = yield select(state => state.user.token);
  let errorResponse;
  let project;
  yield arrowAxios
    .get(`/projects/${code}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      project = response.data;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorResponse = error.response;
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });

  if (errorResponse) {
    yield checkAuth(errorResponse);
  }

  if (yield typeof project !== 'undefined') {
    yield convertDates(project);
    yield put(setProject(project));
  }
}

export function* submitProject() {
  const token = yield select(state => state.user.token);
  const project = yield select(state => state.projects.createProject);
  const proj = cloneDeep(project);
  proj.milestones.forEach(milestone => {
    milestone.date = new Date(milestone.date).toISOString();
  });
  let success = false;
  yield arrowAxios
    .post('/projects', proj, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      success = true;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (yield success) {
    push('/projects');
  }
}

export function* submitTask({ payload: { code } }) {
  const token = yield select(state => state.user.token);
  const task = cloneDeep(yield select(state => state.projects.editTask));
  task.milestones.forEach(milestone => {
    milestone.date = new Date(milestone.date).toISOString();
  });
  task.deadline = new Date(task.deadline).toISOString();
  const { subtasks } = task;
  task.subtasks = undefined;
  let success = false;
  let taskid;
  yield arrowAxios
    .post(`/projects/${code}/tasks`, task, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      success = true;
      taskid = response.data.id;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (yield success) {
    for (let i = 0; i < subtasks.length; i++) {
      yield submitSubTask(taskid, subtasks[i]);
    }
    push(`/project/${code}`);
  }
}

export function* submitSubTask(taskid, subtask) {
  const token = yield select(state => state.user.token);
  subtask.deadline = new Date(subtask.deadline).toISOString();
  let success = false;
  yield arrowAxios
    .post(`/tasks/${taskid}/subtasks/`, subtask, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      success = true;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
}

export function* submitSubTaskAndRedirect(payload) {
  yield submitSubTaskHelper(payload, true);
}

export function* submitSubTaskHelper({ payload: { taskid, code } }, redirect) {
  const token = yield select(state => state.user.token);
  const subtask = cloneDeep(yield select(state => state.projects.editSubTask));
  subtask.deadline = new Date(subtask.deadline).toISOString();
  let success = false;
  yield arrowAxios
    .post(`/tasks/${taskid}/subtasks/`, subtask, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      success = true;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (redirect) {
    if (yield success) {
      push(`/project/${code}`);
    }
  }
}

export function* patchSubTask(subtask) {
  const token = yield select(state => state.user.token);
  subtask.deadline = new Date(subtask.deadline).toISOString();
  yield arrowAxios
    .patch(`/subtasks/${subtask.id}`, subtask, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => { })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
}

export function* patchSubTaskAndRedirect(payload) {
  yield patchSubTaskHelper(payload, true);
}

export function* patchSubTaskHelper({ payload: { code } }, redirect) {
  const token = yield select(state => state.user.token);
  const subtask = cloneDeep(yield select(state => state.projects.editSubTask));
  subtask.deadline = new Date(subtask.deadline).toISOString();
  let success = false;
  yield arrowAxios
    .patch(`/subtasks/${subtask.id}`, subtask, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      success = true;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (redirect) {
    if (yield success) {
      push(`/project/${code}`);
    }
  }
}

export function* patchTask({ payload: { code } }) {
  const token = yield select(state => state.user.token);
  const task = cloneDeep(yield select(state => state.projects.editTask));
  task.milestones.forEach(milestone => {
    milestone.date = new Date(milestone.date).toISOString();
  });
  task.deadline = new Date(task.deadline).toISOString();
  const { subtasks } = task;
  const { deletedSubtasks } = task;
  task.subtasks = undefined;
  let success = false;
  yield arrowAxios
    .patch(`/tasks/${task.id}`, task, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      success = true;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (yield success) {
    for (var i = 0; i < subtasks.length; i++) {
      if (subtasks[i].id) {
        yield patchSubTask(subtasks[i]);
      } else {
        yield submitSubTask(task.id, subtasks[i]);
      }
    }
    for (var i = 0; i < deletedSubtasks.length; i++) {
      yield deleteSubTask(deletedSubtasks[i]);
    }
    push(`/project/${code}`);
  }
}

export function* setTaskCompletion({ payload: { id, completed, isSubTask, code } }) {
  const token = yield select(state => state.user.token);
  const url = (isSubTask ? '/subtasks/' : '/tasks/') + id;
  yield arrowAxios
    .patch(
      url,
      { completed },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  yield put({
    type: ActionTypes.LOAD_PROJECT,
    payload: {
      code,
    },
  });
}

export function* joinProject({ payload: { code } }) {
  yield putHelper(`/join/${code}`, {}, `/project/${code}`);
  yield put(setPendingJoin(null));
}

export function* expelMembers({ payload: { code, members } }) {
  const token = yield select(state => state.user.token);
  let errorResponse;
  yield arrowAxios
    .post(`/projects/${code}/expel`, members, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => { })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorResponse = error.response;
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (errorResponse) {
    yield checkAuth(errorResponse);
  }
}

function* putHelper(url, payload, redirect) {
  const token = yield select(state => state.user.token);
  let success = false;
  let errorResponse;
  yield arrowAxios
    .put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      success = true;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorResponse = error.response;
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (errorResponse) {
    yield checkAuth(errorResponse);
  }
  if (yield success && redirect) {
    push(redirect);
  }
}

export function* patchProject() {
  const project = yield select(state => state.projects.createProject);
  const proj = cloneDeep(project);
  proj.milestones.forEach(milestone => {
    milestone.date = new Date(milestone.date).toISOString();
  });
  yield putHelper(`/projects/${project.project.code}`, proj, `/project/${project.project.code}`);
}

function* deleteHelper(url, redirect) {
  const token = yield select(state => state.user.token);
  let success = false;
  yield arrowAxios
    .delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then(response => {
      success = true;
    })
    .catch(error => {
      let errorMsg = 'Unable to connect to server';
      if (error.response) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
    });
  if (yield success && redirect) {
    push(redirect);
  }
}

export function* deleteProject({ payload: { code } }) {
  yield deleteHelper(`/projects/${code}`, '/projects');
}

export function* deleteTask({ payload: { code, taskid } }) {
  yield deleteHelper(`/tasks/${taskid}`, `/project/${code}`);
}

export function* deleteSubTaskAndRedirect({ payload: { code, subtaskid } }) {
  yield deleteHelper(`/subtasks/${subtaskid}`, `/project/${code}`);
}

export function* deleteSubTask(subtaskid) {
  yield deleteHelper(`/subtasks/${subtaskid}`, undefined);
}

/**
 * GitHub Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.LOAD_PROJECTS, loadProjects),
    takeLatest(ActionTypes.SUBMIT_NEW_PROJECT, submitProject),
    takeLatest(ActionTypes.DELETE_PROJECT, deleteProject),
    takeLatest(ActionTypes.PATCH_PROJECT, patchProject),
    takeLatest(ActionTypes.SUBMIT_TASK, submitTask),
    takeLatest(ActionTypes.PATCH_TASK, patchTask),
    takeLatest(ActionTypes.DELETE_TASK, deleteTask),
    takeLatest(ActionTypes.SET_TASK_COMPLETION, setTaskCompletion),
    takeLatest(ActionTypes.SUBMIT_SUB_TASK_AND_REDIRECT, submitSubTaskAndRedirect),
    takeLatest(ActionTypes.PATCH_SUB_TASK_AND_REDIRECT, patchSubTaskAndRedirect),
    takeLatest(ActionTypes.DELETE_SUB_TASK_AND_REDIRECT, deleteSubTaskAndRedirect),
    takeLatest(ActionTypes.JOIN_PROJECT, joinProject),
    takeLatest(ActionTypes.EXPEL_MEMBERS, expelMembers),
    takeLatest(ActionTypes.LOAD_PROJECT, loadProject),
  ]);
}
