import { Box, Button, ButtonBase, Container, Grid, Paper, withStyles } from '@material-ui/core';
import { blue, deepPurple, green, grey, indigo, purple, teal } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Delete from '@material-ui/icons/DeleteOutlined';
import TickIcon from '@material-ui/icons/Done';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
  addSubTask,
  deleteSubTask,
  deleteTask,
  loadProject,
  loadTaskForEdit,
  patchTask,
  resetEditTask,
  setSubTaskAssignees,
  setSubTaskDeadline,
  setSubTaskDescription,
  setSubTaskTitle,
  setTaskAssignees,
  setTaskColor,
  setTaskDeadline,
  setTaskDescription,
  setTaskMilestones,
  setTaskTitle,
  submitTask,
} from '../actions';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Header from '../components/Header';
import Loader from '../components/Loader';
import NumberCircle from '../components/NumberCircle';
import SelectMembers from '../components/SelectMembers';
import SelectMilestones from '../components/SelectMilestones';
import SubTaskEdit from '../components/SubTaskEdit';
import WhiteLabelTextField from '../components/WhiteLabelTextField';
import { push } from '../modules/history';

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

function HeaderComponent({
  classes,
  project,
  task,
  setTaskTitle,
  setTaskDeadline,
  setTaskDescription,
  setTaskColor,
  setAssignees,
  setMilestones,
  onClickDelete,
}) {
  const colorScheme = getColorScheme(task.color);
  const isAssignee = member => task.assignees.find(assignee => assignee.email == member.email);
  const isAssignedMilestone = milestone =>
    task.milestones.find(milestone2 => milestone.id == milestone2.id);
  return (
    <Grid container direction="column" spacing={2}>
      <Grid container item alignItems="center" spacing={2}>
        <Box flexGrow={1}>
          <WhiteLabelTextField
            color={colorScheme ? colorScheme[500] : '#828282'}
            variant="filled"
            label="Task Title"
            value={task.title}
            onChange={setTaskTitle}
            fullWidth
          />
        </Box>
        <Grid item>
          <Button onClick={onClickDelete}>
            <Delete style={{ fontSize: '4em', color: '#DADADA' }} />
          </Button>
        </Grid>
      </Grid>
      <Grid container item spacing={2} style={{ paddingBottom: '1em', width: '80%' }}>
        <WhiteLabelTextField
          variant="filled"
          color={colorScheme ? colorScheme[500] : '#828282'}
          label="Deadline"
          onChange={setTaskDeadline}
          value={task.deadline}
          fullWidth
          type="date"
        />
      </Grid>
      <Grid container item spacing={2} style={{ width: '80%' }}>
        <WhiteLabelTextField
          variant="filled"
          color={colorScheme ? colorScheme[500] : '#828282'}
          label="Description"
          onChange={setTaskDescription}
          value={task.description}
          multiline
          fullWidth
          rows={2}
          rowsMax={3}
          type="date"
        />
      </Grid>
      <Grid container item direction="column" spacing={1}>
        <Grid item>
          <Box color="white" fontSize={12}>
            Head Deadlines
          </Box>
        </Grid>
        <SelectMilestones
          milestones={project.milestones}
          isChosen={isAssignedMilestone}
          onChoose={milestone =>
            setMilestones(
              isAssignedMilestone(milestone)
                ? task.milestones.filter(milestone2 => milestone2.id != milestone.id)
                : [milestone],
            )
          }
        />
      </Grid>
      <Grid container item direction="column" spacing={1}>
        <Grid item>
          <Box color="white" fontSize={12}>
            I/Cs
          </Box>
        </Grid>
        <Grid container item spacing={1}>
          <SelectMembers
            members={project.members}
            isChosen={isAssignee}
            onChoose={member =>
              setAssignees(
                isAssignee(member)
                  ? task.assignees.filter(assignee => assignee.email != member.email)
                  : [...task.assignees].concat([member]),
              )
            }
          />
        </Grid>
      </Grid>
      <Grid container item direction="column" spacing={1}>
        <Grid item>
          <Box color="white" fontSize={12}>
            Colour
          </Box>
        </Grid>
        <Grid container item spacing={2}>
          {taskColors.map(color => (
            <Grid item>
              <ButtonBase onClick={() => setTaskColor(color)}>
                <Box
                  className={classes.colorOption}
                  bgcolor={color}
                  style={{ opacity: task.color == color ? 1 : 0.5 }}
                >
                  {task.color == color && <TickIcon />}
                </Box>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

function EditTask({
  classes,
  task,
  projects,
  loadProject,
  loadTask,
  resetTask,
  setTaskTitle,
  setTaskDeadline,
  setTaskDescription,
  setTaskColor,
  setAssignees,
  setMilestones,
  addSubTask,
  setSubTaskAssignees,
  setSubTaskDeadline,
  setSubTaskDescription,
  setSubTaskTitle,
  deleteSubTask,
  submitTask,
  patchTask,
  deleteTask,
  match: {
    params: { code, taskid },
  },
}) {
  const project = projects[code];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  useEffect(() => {
    if (!projects[code]) {
      loadProject(code);
    } else if (taskid) {
      loadTask(code, taskid);
    } else {
      resetTask();
    }
  }, [projects[code]]);
  if (!project || !task) {
    return <Loader />;
  }
  const colorScheme = getColorScheme(task.color);
  return (
    <>
      <Header
        contentComponent={HeaderComponent}
        backPath={`/project/${code}`}
        height="28em"
        color={getHeaderColor(task)}
        backColor="#BDBDBD"
        headerProps={{
          classes,
          project,
          task,
          setTaskTitle,
          setTaskDeadline,
          setTaskDescription,
          setTaskColor,
          setAssignees,
          setMilestones,
          onClickDelete: () => setDeleteDialogOpen(true),
        }}
      />
      <Paper className={classes.paperRoot}>
        <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container direction="column" spacing={5} style={{ width: '95%' }}>
            <Grid container item spacing={2} alignItems="center">
              <Grid container item spacing={1} style={{ width: '85%' }} alignItems="center">
                <Box fontWeight={500} fontSize="16px">
                  Sub-Tasks
                </Box>
                <Grid item>
                  <NumberCircle num={task.subtasks.length} color={colorScheme[50]} />
                </Grid>
              </Grid>
              <Grid item>
                <ButtonBase onClick={addSubTask}>
                  <AddIcon style={{ fontSize: '2.5em' }} />
                </ButtonBase>
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction="column"
              spacing={3}
              style={{ maxHeight: '50vh', flexWrap: 'nowrap', overflowY: 'auto' }}
            >
              {task.subtasks.map((subtask, index) => (
                <SubTaskEdit
                  subtask={subtask}
                  index={index}
                  members={project.members}
                  setTitle={setSubTaskTitle(index)}
                  setAssignees={setSubTaskAssignees(index)}
                  setDescription={setSubTaskDescription(index)}
                  setDeadline={setSubTaskDeadline(index)}
                  deleteSubTask={deleteSubTask(index)}
                />
              ))}
            </Grid>
            <Grid
              container
              item
              justify="flex-end"
              spacing={2}
              alignItems="center"
              style={{ paddingBottom: '2em' }}
            >
              <Grid item>
                <ButtonBase>
                  <Box color={colorScheme[500]}>Discard Changes</Box>
                </ButtonBase>
              </Grid>
              <Grid item>
                <ButtonBase onClick={() => (taskid ? patchTask(code) : submitTask(code))}>
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
              if (taskid) {
                deleteTask(project.project.code, task.id);
              } else {
                push(`/project/${project.project.code}`);
              }
            }}
            title="Delete Task?"
            content={() => (
              <>
                {' '}
                Are you sure you want to PERMANENTLY delete this task, along with its sub-tasks?
                <br />
                <br />
                This action is IRREVERSIBLE.
              </>
            )}
            cancelText="No, Go Back"
            confirmText="Yes, Delete Task"
          />
        </Container>
      </Paper>
    </>
  );
}

HeaderComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  setAssignees: PropTypes.func.isRequired,
  setMilestones: PropTypes.func.isRequired,
  setTaskColor: PropTypes.func.isRequired,
  setTaskDeadline: PropTypes.func.isRequired,
  setTaskDescription: PropTypes.func.isRequired,
  setTaskTitle: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

EditTask.propTypes = {
  addSubTask: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  deleteSubTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  loadProject: PropTypes.func.isRequired,
  loadTask: PropTypes.func.isRequired,
  patchTask: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired,
  resetTask: PropTypes.func.isRequired,
  setAssignees: PropTypes.func.isRequired,
  setMilestones: PropTypes.func.isRequired,
  setSubTaskAssignees: PropTypes.func.isRequired,
  setSubTaskDeadline: PropTypes.func.isRequired,
  setSubTaskDescription: PropTypes.func.isRequired,
  setSubTaskTitle: PropTypes.func.isRequired,
  setTaskColor: PropTypes.func.isRequired,
  setTaskDeadline: PropTypes.func.isRequired,
  setTaskDescription: PropTypes.func.isRequired,
  setTaskTitle: PropTypes.func.isRequired,
  submitTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    projects: state.projects.projects,
    task: state.projects.editTask,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetTask: () => dispatch(resetEditTask()),
    loadProject: code => dispatch(loadProject(code)),
    loadTask: (code, taskid) => dispatch(loadTaskForEdit(code, taskid)),
    setTaskTitle: event => dispatch(setTaskTitle(event.target.value)),
    setTaskDescription: event => dispatch(setTaskDescription(event.target.value)),
    setTaskDeadline: event => dispatch(setTaskDeadline(event.target.value)),
    setTaskColor: color => dispatch(setTaskColor(color)),
    setAssignees: assignees => dispatch(setTaskAssignees(assignees)),
    setMilestones: milestones => dispatch(setTaskMilestones(milestones)),
    addSubTask: () => dispatch(addSubTask()),
    setSubTaskTitle: index => event => dispatch(setSubTaskTitle(index, event.target.value)),
    setSubTaskDeadline: index => event => dispatch(setSubTaskDeadline(index, event.target.value)),
    setSubTaskDescription: index => event =>
      dispatch(setSubTaskDescription(index, event.target.value)),
    setSubTaskAssignees: index => assignees => dispatch(setSubTaskAssignees(index, assignees)),
    deleteSubTask: index => () => dispatch(deleteSubTask(index)),
    submitTask: code => dispatch(submitTask(code)),
    patchTask: code => dispatch(patchTask(code)),
    deleteTask: (code, taskid) => dispatch(deleteTask(code, taskid)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(EditTask));
