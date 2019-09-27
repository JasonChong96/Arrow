import { Box, ButtonBase, Container, Grid, Paper, withStyles } from '@material-ui/core';
import { blue, deepPurple, green, grey, indigo, purple, teal } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  deleteSubTaskAndRedirect,
  loadProject,
  loadSubTaskForEdit,
  patchSubTaskAndRedirect,
  resetEditSubTask,
  setSubTaskAssignees,
  setSubTaskDeadline,
  setSubTaskDescription,
  setSubTaskTitle,
  submitSubTaskAndRedirect,
} from '../actions';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Header from '../components/Header';
import Loader from '../components/Loader';
import MembersList from '../components/MembersList';
import SubTaskEdit from '../components/SubTaskEdit';
import { push } from '../modules/history';
import { getDayString } from '../modules/helpers';

const styles = {
  paperRoot: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
    zIndex: 1200,
    marginTop: '-1em',
    flexGrow: 1,
    boxShadow:
      '0px -1px 5px rgba(0, 0, 0, 0.2), 0px -2px 5px rgba(0, 0, 0, 0.12), 0px 0px 5px rgba(0, 0, 0, 0.14)',
  },
  doneButton: {
    borderRadius: '200px',
    color: 'white',
    textTransform: 'none',
    padding: '0.5em 1em 0.5em 1em',
  },
  colorOption: {
    height: '2.55em',
    width: '2.55em',
    borderRadius: '0.375em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const colors = [teal, green, indigo, blue, deepPurple, purple, grey];

const taskColors = colors.map(color => color[500]);

function getColorScheme(taskColor) {
  return colors.find(color => color[500] == taskColor);
}

function getHeaderColor(task) {
  if (!task) {
    return '#333333';
  }
  const colorScheme = getColorScheme(task.color);
  if (colorScheme == grey) {
    return '#333333';
  }
  return colorScheme ? colorScheme[700] : '#333333';
}

function HeaderComponent({ classes, task }) {
  const colorScheme = getColorScheme(task.color);
  return (
    <Grid container direction="column" spacing={2} style={{ color: colorScheme[50] }}>
      <Grid item>
        <Box fontSize="2.125em">{task.title}</Box>
      </Grid>
      <Grid item>
        <Box fontSize="0.875em">
          {task.deadline
            .toISOString()
            .substring(0, 10)
            .replace('-', '/')}
          , {getDayString(task.deadline)}
        </Box>
      </Grid>
      <Grid item>
        <Box fontSize="0.875em">{task.description}</Box>
      </Grid>
      <Grid container item>
        <MembersList members={task.assignees} />
      </Grid>
    </Grid>
  );
}

function EditSubTask({
  classes,
  projects,
  subtask,
  loadProject,
  resetSubTask,
  loadSubTask,
  setTitle,
  setDeadline,
  setAssignees,
  setDescription,
  submitSubTask,
  deleteSubTask,
  patchSubTask,
  match: {
    params: { code, taskid, subtaskid },
  },
}) {
  const project = projects[code];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  useEffect(() => {
    if (!projects[code]) {
      loadProject(code);
    } else if (subtaskid) {
      loadSubTask(code, taskid, subtaskid);
    } else {
      resetSubTask();
    }
  }, [projects[code]]);

  if (!project || !subtask) {
    return <Loader />;
  }
  const task = project.tasks.find(task => task.id == taskid);
  const colorScheme = getColorScheme(task.color);
  return (
    <>
      <Header
        contentComponent={HeaderComponent}
        backPath={`/project/${code}`}
        height="16em"
        color={getHeaderColor(task)}
        backColor="#BDBDBD"
        headerProps={{
          classes,
          project,
          task,
        }}
      />
      <Paper className={classes.paperRoot}>
        <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container direction="column" style={{ width: '95%' }}>
            <Box height="3em" />
            <SubTaskEdit
              subtask={subtask}
              index={0}
              collapsible={false}
              members={project.members}
              setTitle={setTitle}
              setAssignees={setAssignees}
              setDescription={setDescription}
              setDeadline={setDeadline}
              deleteSubTask={() => setDeleteDialogOpen(true)}
            />
            <Grid container item justify="flex-end" spacing={2} alignItems="center">
              <Grid item>
                <ButtonBase>
                  <Box color={colorScheme[500]}>Discard Changes</Box>
                </ButtonBase>
              </Grid>
              <Grid item>
                <ButtonBase
                  onClick={() => (subtaskid ? patchSubTask(code) : submitSubTask(code, taskid))}
                >
                  <Box className={classes.doneButton} bgcolor={colorScheme[500]}>
                    Done!
                  </Box>
                </ButtonBase>
              </Grid>
            </Grid>
          </Grid>
          <ConfirmationDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={() => {
              setDeleteDialogOpen(false);
              if (subtaskid) {
                deleteSubTask(code, subtaskid);
              } else {
                push(`/project/${project.project.code}`);
              }
            }}
            title="Delete Sub-Task?"
            content={() => (
              <>
                {' '}
                Are you sure you want to PERMANENTLY delete this sub-task?
                <br />
                <br />
                This action is IRREVERSIBLE.
              </>
            )}
            cancelText="No, Go Back"
            confirmText="Yes, Delete Sub-Task"
          />
        </Container>
      </Paper>
    </>
  );
}

EditSubTask.propTypes = {
  classes: PropTypes.object.isRequired,
  deleteSubTask: PropTypes.func.isRequired,
  loadProject: PropTypes.func.isRequired,
  loadSubTask: PropTypes.func.isRequired,
  patchSubTask: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired,
  resetSubTask: PropTypes.func.isRequired,
  setAssignees: PropTypes.func.isRequired,
  setDeadline: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  submitSubTask: PropTypes.func.isRequired,
  subtask: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    projects: state.projects.projects,
    subtask: state.projects.editSubTask,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadProject: code => dispatch(loadProject(code)),
    loadSubTask: (code, taskid, subtaskid) => dispatch(loadSubTaskForEdit(code, taskid, subtaskid)),
    resetSubTask: () => dispatch(resetEditSubTask()),
    setTitle: event => dispatch(setSubTaskTitle(undefined, event.target.value)),
    setDescription: event => dispatch(setSubTaskDescription(undefined, event.target.value)),
    setAssignees: assignees => dispatch(setSubTaskAssignees(undefined, assignees)),
    setDeadline: event => dispatch(setSubTaskDeadline(undefined, event.target.value)),
    submitSubTask: (code, taskid) => dispatch(submitSubTaskAndRedirect(code, taskid)),
    patchSubTask: code => dispatch(patchSubTaskAndRedirect(code)),
    deleteSubTask: (code, subtaskid) => dispatch(deleteSubTaskAndRedirect(code, subtaskid)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(EditSubTask));
