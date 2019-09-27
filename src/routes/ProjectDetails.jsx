import {
  Box,
  ButtonBase,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Paper,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import ArrowRightIcon from '@material-ui/icons/ArrowForwardIos';
import EditIcon from '@material-ui/icons/EditOutlined';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadProject, loadProjects, setTaskCompletion } from '../actions';
import Header from '../components/Header';
import Loader from '../components/Loader';
import PersonalGroupSwitch from '../components/PersonalGroupSwitch';
import ProjectEntry from '../components/ProjectEntry';
import RemainingTasksCircle from '../components/RemainingTasksCircle';
import theme from '../modules/theme';
import { daysTill, getMonthString } from '../modules/helpers';

const styles = {
  chipMilestone: {
    background: theme.palette.primary[700],
    color: theme.palette.primary[50],
    borderRadius: '16px',
    fontSize: '14px',
  },
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
};

function containsMilestone(task, milestone) {
  return task.milestones.find(milestone2 => milestone.id == milestone2.id);
}

function isTaskAssignedTo(task, member) {
  return task.assignees.find(assignee => assignee.email == member.email);
}

function ProjectDetails({
  classes,
  online,
  loadProject,
  loadProjects,
  projects,
  setCompletion,
  user,
  match: {
    params: { code },
  },
}) {
  const [dialogState, setDialogState] = useState(0);
  const [showPersonalOnly, setShowPersonalOnly] = useState(false);
  useEffect(() => {
    loadProject(code);
    loadProjects();
  }, []);
  const project = projects[code];
  if (!project) {
    return <Loader />;
  }
  const subTasks = [];
  project.tasks.forEach(task => {
    task.subtasks.forEach(subtask => {
      subTasks.push({
        ...subtask,
        color: task.color,
        milestones: task.milestones,
        taskid: task.id,
      });
    });
  });
  let allTasksAndSubtasks = subTasks.concat(project.tasks);
  const personalLeft = allTasksAndSubtasks.reduce(
    (a, b) => a + (!b.completed && isTaskAssignedTo(b, user) ? 1 : 0),
    0,
  );
  const teamLeft = allTasksAndSubtasks.reduce((a, b) => a + (b.completed ? 0 : 1), 0);
  if (showPersonalOnly) {
    allTasksAndSubtasks = allTasksAndSubtasks.filter(entry => isTaskAssignedTo(entry, user));
  }
  allTasksAndSubtasks = allTasksAndSubtasks.concat(
    project.milestones.map(milestone => ({
      name: milestone.name,
      deadline: milestone.date,
      tasksLeft: project.tasks.reduce(
        (a, b) =>
          a +
          (!b.completed &&
          containsMilestone(b, milestone) &&
          (!showPersonalOnly || isTaskAssignedTo(b, user))
            ? 1 + b.subtasks.length
            : 0),
        0,
      ),
      isMilestone: true,
    })),
  );
  allTasksAndSubtasks.sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
  );
  let curMonth = new Date().getMonth();
  let prevDate = -1;
  const upcomingMilestone = allTasksAndSubtasks.find(
    entry => entry.isMilestone && entry.deadline > new Date(),
  );
  const headerComponent = () => (
    <Grid container direction="column" spacing={2}>
      <Grid container item wrap="nowrap">
        <Box
          fontSize={24}
          color="black"
          width="65vw"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          {project.project.title}
        </Box>
        <Box alignSelf="flex-end" color="black">
          <Link to={`/project/${code}/edit`}>
            <ButtonBase>
              <EditIcon style={{ fontSize: '3em', color: 'black' }} />
            </ButtonBase>
          </Link>
        </Box>
      </Grid>
      <Grid container item alignItems="center">
        <Box fontSize={20} color="#4F4F4F" marginRight="1em">
          {getMonthString(new Date().getMonth())}
        </Box>
        {upcomingMilestone && (
          <>
            <Box fontSize={14} color="#4F4F4F" marginRight="0.5em">
              {daysTill(upcomingMilestone.deadline)} Days till
            </Box>
            <Chip label={upcomingMilestone.name} className={classes.chipMilestone} />
          </>
        )}
      </Grid>
    </Grid>
  );
  return (
    <>
      <Header contentComponent={headerComponent} backPath="/projects" height="10em" />
      <Paper className={classes.paperRoot}>
        <Container maxWidth="sm" style={{ paddingBottom: '2em' }}>
          <Grid container direction="column" spacing={1}>
            <Grid container item alignItems="center">
              <Grid item style={{ width: '45%' }}>
                <RemainingTasksCircle
                  tasksLeft={showPersonalOnly ? personalLeft : teamLeft}
                  overdue={false}
                />
              </Grid>
              <Grid item style={{ width: '40%' }}>
                <PersonalGroupSwitch
                  onChange={() => setShowPersonalOnly(!showPersonalOnly)}
                  checked={!showPersonalOnly}
                />
              </Grid>
              {online && (
                <Grid item>
                  <ButtonBase onClick={() => setDialogState(1)}>
                    <AddIcon style={{ color: theme.palette.primary[500], fontSize: '3em' }} />
                  </ButtonBase>
                </Grid>
              )}
            </Grid>
            {allTasksAndSubtasks.map(entry => {
              const deadline = entry.deadline.getMonth ? entry.deadline : new Date(entry.deadline);
              const entryMonth = deadline.getMonth();
              const entryDate = deadline.getDate();
              const renderMonth = entryMonth != curMonth;
              const renderDate = entryDate != prevDate || renderMonth;
              prevDate = entryDate;
              curMonth = entryMonth;
              return (
                <ProjectEntry
                  entry={entry}
                  renderMonth={renderMonth}
                  code={code}
                  renderDate={renderDate}
                  setCompletion={setCompletion}
                  online={online}
                />
              );
            })}
          </Grid>
          <Dialog maxWidth="xs" fullWidth open={dialogState == 1} onClose={() => setDialogState(0)}>
            <DialogTitle>Add</DialogTitle>
            <DialogActions>
              <Grid container direction="column" spacing={1}>
                <Grid item style={{ width: '100%' }}>
                  <Link
                    to={online ? `/project/${code}/createtask` : undefined}
                    style={{ width: '100%' }}
                  >
                    <ButtonBase style={{ width: '100%' }}>
                      <Grid
                        container
                        item
                        alignItems="center"
                        justify="center"
                        spacing={1}
                        style={{ color: 'black', fontSize: '1.25em' }}
                      >
                        <Grid item style={{ width: '85%', textAlign: 'start' }}>
                          Task
                        </Grid>
                        <Grid item>
                          <ArrowRightIcon />
                        </Grid>
                      </Grid>
                    </ButtonBase>
                  </Link>
                </Grid>
                <Grid item>
                  <hr
                    style={{
                      border: '0.5px solid #F2F2F2',
                      height: '0.5px',
                      width: '90%',
                    }}
                  />
                </Grid>
                <Grid item>
                  <ButtonBase style={{ width: '100%' }} onClick={() => setDialogState(2)}>
                    <Grid
                      container
                      item
                      alignItems="center"
                      justify="center"
                      spacing={1}
                      style={{ color: 'black', fontSize: '1.25em' }}
                    >
                      <Grid item style={{ width: '85%', textAlign: 'start' }}>
                        Sub-Task
                      </Grid>
                      <Grid item>
                        <ArrowRightIcon />
                      </Grid>
                    </Grid>
                  </ButtonBase>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
          <Dialog maxWidth="xs" fullWidth open={dialogState == 2} onClose={() => setDialogState(0)}>
            <DialogTitle>Add Sub-Task to</DialogTitle>
            <DialogActions>
              <Grid container direction="column" spacing={1}>
                {project.tasks.map(task => (
                  <>
                    <Grid item style={{ width: '100%' }}>
                      <Link
                        to={`/project/${code}/tasks/${task.id}/createsubtask`}
                        style={{ width: '100%' }}
                      >
                        <ButtonBase
                          style={{ width: '100%', borderLeft: `4px solid ${task.color}` }}
                        >
                          <Grid
                            container
                            item
                            alignItems="center"
                            justify="center"
                            spacing={1}
                            style={{ color: 'black', fontSize: '1.25em' }}
                          >
                            <Grid item style={{ width: '85%', textAlign: 'start' }}>
                              {task.title}
                            </Grid>
                            <Grid item>
                              <ArrowRightIcon />
                            </Grid>
                          </Grid>
                        </ButtonBase>
                      </Link>
                    </Grid>
                    <Grid item>
                      <hr
                        style={{
                          border: '0.5px solid #F2F2F2',
                          height: '0.5px',
                          width: '90%',
                        }}
                      />
                    </Grid>
                  </>
                ))}
              </Grid>
            </DialogActions>
          </Dialog>
        </Container>
      </Paper>
    </>
  );
}

ProjectDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  loadProject: PropTypes.func.isRequired,
  loadProjects: PropTypes.func.isRequired,
  online: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  setCompletion: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    projects: state.projects.projects,
    user: state.user,
    online: state.app.online,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadProject: code => dispatch(loadProject(code)),
    loadProjects: () => dispatch(loadProjects()),
    setCompletion: (id, completed, isSubTask, code) =>
      dispatch(setTaskCompletion(id, completed, isSubTask, code)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ProjectDetails));
