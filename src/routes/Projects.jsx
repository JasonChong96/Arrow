import React, { useState, useEffect } from 'react';
import { withStyles, Grid, Button, Typography, Container, Paper, Box, Chip, Switch } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import UserTextField from '../components/UserTextField';
import theme from '../modules/theme';
import PasswordField from '../components/PasswordField';
import Header from '../components/Header';
import TitleOnlyHeader from '../components/TitleOnlyHeader';
import { loadProjects } from '../actions';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Person from '@material-ui/icons/Person';
import People from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Project from '../components/Project';
import { Link } from 'react-router-dom';


function validateEmail(mail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

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
        boxShadow: '0px -1px 5px rgba(0, 0, 0, 0.2), 0px -2px 5px rgba(0, 0, 0, 0.12), 0px 0px 5px rgba(0, 0, 0, 0.14)',
    },
    headerRoot: {
        marginLeft: '1em',
        width: 'auto'
    },
    rootGrid: {
        marginTop: '2em',
        paddingBottom: '2em',
    },
};



function Projects({ classes, dispatch, projects }) {
    useEffect(() => {
        dispatch(loadProjects());
    }, [])

    const headerComponent = () =>
        <Grid container alignItems='center' spacing={2} className={classes.headerRoot}>
            <Grid item>
                <AccountIcon style={{ fontSize: '4em', color: '#333333' }} />
            </Grid>
            <Grid item style={{ flexGrow: 0.8 }}>
                <Box fontWeight={600} fontSize={24} color="black">
                    Dead Bee
            </Box>
            </Grid>
            <Grid item>
                <Grid component="label" container alignItems="center">
                    <Grid item><Person style={{ color: 'black', fontSize: '1.5em' }} /></Grid>
                    <Grid item>
                        <Switch
                            checked={showGroupTasks}
                            onChange={() => setShowGroupTasks(!showGroupTasks)}
                            style={{ color: 'white' }}
                        />
                    </Grid>
                    <Grid item><People style={{ color: 'black', fontSize: '1.5em' }} /></Grid>
                </Grid>
            </Grid>
        </Grid>

    const [showGroupTasks, setShowGroupTasks] = useState(false);
    return (
        <>
            <Header contentComponent={headerComponent} />
            <Paper className={classes.paperRoot}>
                <Grid container spacing={1} direction='column' className={classes.rootGrid}>
                    {projects.map(project => {
                        const daysLeft = project.upcoming_milestone ? daysTill(new Date(project.upcoming_milestone.date)) : 0;
                        const title = project.project.title;
                        const upcomingMilestone = project.upcoming_milestone ? project.upcoming_milestone.name : null;
                        const tasksLeft = showGroupTasks ? project.team_todos : project.personal_todos;
                        const isOverdue = showGroupTasks ? project.team_overdue : project.personal_overdue;
                        const code = project.project.code;
                        return <><Project
                            title={title}
                            daysLeft={daysLeft}
                            milestoneLabel={upcomingMilestone}
                            tasksLeft={tasksLeft}
                            overdue={isOverdue}
                            code={code} />
                            <hr style={{
                                background: 'rgba(0, 0, 0, 0.12)',
                                height: '0.5px',
                                width: '80%',
                            }} />
                        </>
                    })}
                    <Link to="/createproject">
                        <Grid container spacing={2} style={{ marginTop: '1em', justifyContent: 'center' }}>
                            <Grid item>
                                <AddIcon />
                            </Grid>
                            <Grid item>
                                Add New Project
                        </Grid>
                        </Grid>
                    </Link>
                </Grid>
                <Container maxWidth="sm">

                </Container>
            </Paper>
        </>
    );
}

function daysTill(date2) {
    const date1 = new Date();
    const timeDiff = date2.getTime() - date1.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return Math.floor(daysDiff);
}

Projects.propTypes = {
    dispatch: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        projects: state.projects.projectOverviews,
    };
}

export default connect(mapStateToProps)(withStyles(styles)(Projects));
