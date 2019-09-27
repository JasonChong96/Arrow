import { Box, Button, Grid, Paper, withStyles } from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { loadProjects, logOut } from '../actions';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Header from '../components/Header';
import PersonalGroupSwitch from '../components/PersonalGroupSwitch';
import Project from '../components/Project';
import theme from '../modules/theme';
import { daysTill } from '../modules/helpers';

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: '2em 0em 2em 0em',
  },
  fieldsGrid: {
    width: '85%',
  },
  width: {
    width: '100%',
  },
  signUpButton: {
    background: theme.palette.primary[500],
    borderRadius: '200px',
    width: '100%',
    color: 'white',
    textTransform: 'none',
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
  headerRoot: {
    marginLeft: '1em',
    width: 'auto',
  },
  rootGrid: {
    marginTop: '2em',
    paddingBottom: '2em',
  },
};

function Projects({
  classes,
  loadProjects,
  projects,
  user,
  pendingJoin,
  logOut,
  online,
  projectsCache,
}) {
  useEffect(() => {
    loadProjects();
  }, []);

  const headerComponent = () => (
    <Grid
      container
      alignItems="center"
      spacing={1}
      className={classes.headerRoot}
      justify="space-around"
    >
      <Grid item>
        <AccountIcon style={{ fontSize: '3em', color: '#333333' }} />
      </Grid>
      <Grid item style={{ width: '40%' }}>
        <Box
          fontWeight={600}
          fontSize="24px"
          color="black"
          maxWidth="50vw"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          {user.displayName}
        </Box>
      </Grid>
      <Grid item>
        <PersonalGroupSwitch
          onChange={() => setShowGroupTasks(!showGroupTasks)}
          checked={showGroupTasks}
        />{' '}
      </Grid>
    </Grid>
  );

  const [showGroupTasks, setShowGroupTasks] = useState(false);
  const [showLogOutDialog, setShowLogOutDialog] = useState(false);
  const projectsToDisplay = online
    ? projects
    : projects.filter(project => projectsCache[project.project.code]);
  return (
    <>
      {pendingJoin.code && (
        <Redirect to={`/project/${pendingJoin.code}/join/${pendingJoin.title}`} />
      )}
      <Header contentComponent={headerComponent} />
      <Paper className={classes.paperRoot}>
        <Grid container spacing={1} direction="column" className={classes.rootGrid}>
          <Grid
            container
            item
            spacing={1}
            direction="column"
            style={{ height: '70vh', overflowY: 'auto', overflowX: 'hidden', flexWrap: 'nowrap' }}
          >
            {projectsToDisplay.map(project => {
              const daysLeft = project.upcoming_milestone
                ? daysTill(new Date(project.upcoming_milestone.date))
                : 0;
              const { title } = project.project;
              const upcomingMilestone = project.upcoming_milestone
                ? project.upcoming_milestone.name
                : null;
              const tasksLeft = showGroupTasks ? project.team_todos : project.personal_todos;
              const isOverdue = showGroupTasks ? project.team_overdue : project.personal_overdue;
              const { code } = project.project;
              return (
                <>
                  <Project
                    title={title}
                    daysLeft={daysLeft}
                    milestoneLabel={upcomingMilestone}
                    tasksLeft={tasksLeft}
                    overdue={isOverdue}
                    code={code}
                  />
                  <hr
                    style={{
                      background: 'rgba(0, 0, 0, 0.12)',
                      height: '0.5px',
                      width: '80%',
                    }}
                  />
                </>
              );
            })}
            {online && (
              <Link to="/createproject">
                <Grid container spacing={2} style={{ marginTop: '1em', justifyContent: 'center' }}>
                  <Grid item>
                    <AddIcon />
                  </Grid>
                  <Grid item>Add New Project</Grid>
                </Grid>
              </Link>
            )}
          </Grid>
          {online && (
            <Button onClick={() => setShowLogOutDialog(true)}>
              <Box
                display="flex"
                color="red"
                fontSize="1.5em"
                justifyContent="center"
                alignContent="center"
                marginTop="2em"
                height="5vh"
              >
                <LogoutIcon style={{ fontSize: '1.5em' }} />
                <span> </span>Log out
              </Box>
            </Button>
          )}
        </Grid>
        <ConfirmationDialog
          open={showLogOutDialog}
          onClose={() => setShowLogOutDialog(false)}
          onConfirm={() => logOut()}
          title="Confirm Log Out"
          content={() => <>Are you sure you want to log out?</>}
        />
      </Paper>
    </>
  );
}

Projects.propTypes = {
  classes: PropTypes.object.isRequired,
  online: PropTypes.bool.isRequired,
  pendingJoin: PropTypes.object,
  projects: PropTypes.array.isRequired,
  projectsCache: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    projects: state.projects.projectOverviews,
    user: state.user,
    pendingJoin: state.projects.pendingJoin,
    online: state.app.online,
    projectsCache: state.projects.projects,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(logOut()),
    loadProjects: () => dispatch(loadProjects(true)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Projects));
