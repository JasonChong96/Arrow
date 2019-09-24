import React, { useState, useEffect } from 'react';
import { withStyles, Grid, Button, Typography, Container, Paper, Box, Chip, Switch, TextField, ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import UserTextField from '../components/UserTextField';
import theme from '../modules/theme';
import PasswordField from '../components/PasswordField';
import Header from '../components/Header';
import TitleOnlyHeader from '../components/TitleOnlyHeader';
import { loadProjects, setNewProjectTitle, addNewProjectMilestone, setNewProjectMilestoneName, setNewProjectMilestoneDeadline, addNewProjectMember, deleteNewProjectMilestone, submitNewProject } from '../actions';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Person from '@material-ui/icons/Person';
import People from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Project from '../components/Project';
import { Link } from 'react-router-dom';
import Delete from '@material-ui/icons/DeleteOutlined';
import NumberCircle from '../components/NumberCircle';
import MembersList from '../components/MembersList';

const styles = {
    paperRoot: {
        borderRadius: 20,
        width: '100%',
        height: '100%',
        zIndex: 1200,
        marginTop: '-1em',
        flexGrow: 1,
        boxShadow: '0px -1px 5px rgba(0, 0, 0, 0.2), 0px -2px 5px rgba(0, 0, 0, 0.12), 0px 0px 5px rgba(0, 0, 0, 0.14)',
    },
    doneButton: {
        background: theme.palette.primary[500],
        borderRadius: '200px',
        color: 'white',
        textTransform: 'none',
        padding: '0.5em 1em 0.5em 1em'
    },
};

function HeaderComponent({ classes, updateTitle, project }) {
    return <Grid container direction='column' spacing={2}>
        <Grid container item alignItems='center' spacing={2}>
            <Box flexGrow={1}>
                <TextField
                    key='aaaaaa'
                    variant='filled'
                    label='Project Title'
                    value={project.project.title}
                    onChange={updateTitle}
                    fullWidth />
            </Box>
            <Grid item>
                <Button>
                    <Delete style={{ fontSize: '4em', color: '#DADADA' }} />
                </Button>
            </Grid>
        </Grid>
        <Grid container item direction='column'>
            <Grid container item alignItems='center'>
                <Box fontSize={12}>
                    Members
        </Box>
                <Grid item>
                    <NumberCircle num={project.members.length} />
                </Grid>
                <Box flexGrow={1} />
                <Box flexGrow={0.25} fontSize={12}>
                    <Button style={{ textTransform: 'none', color: 'white', fontSize: 12 }}>
                        Remove
            </Button>
                </Box>
            </Grid>
            <Grid container item alignItems='center' spacing={1} direction='row' style={{ overflowX: 'auto' }}>
                <MembersList members={project.members} />
                <Grid container item direction='column' style={{ width: 'auto' }} alignItems='center'>
                    <Grid item>
                        <ButtonBase style={{ display: 'inline-block' }}>
                            <AddIcon style={{ fontSize: 48 }} />
                        </ButtonBase>
                    </Grid>
                    <Box fontSize={12}>
                        <br />
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    </Grid >

}

function CreateProject({
    classes,
    updateTitle,
    project,
    addMilestone,
    deleteMilestone,
    setMilestoneName,
    setMilestoneDeadline,
    user,
    addMember,
    submitProject, }) {
    useEffect(() => {
        if (project.members.length == 0) {
            addMember(user.displayName, user.email);
        }
    }, [])
    return (
        <>
            <Header contentComponent={HeaderComponent} backPath={'/projects'} height='16em' color={theme.palette.primary[700]} headerProps={{ classes, updateTitle, project }} />
            <Paper className={classes.paperRoot}>
                <Container maxWidth='sm' style={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid container direction='column' spacing={3} style={{ width: '95%' }}>
                        <Grid container item spacing={2} alignItems='center'>
                            <Grid container item spacing={1} style={{ width: '85%' }} alignItems='center'>
                                <Box fontWeight={500} fontSize='16px'>
                                    Hard Deadlines
                            </Box>
                                <Grid item>
                                    <NumberCircle num={project.milestones.length} />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <ButtonBase onClick={addMilestone}>
                                    <AddIcon style={{ fontSize: '2.5em' }} />
                                </ButtonBase>
                            </Grid>
                        </Grid>
                        {project.milestones.map((milestone, index) => (
                            <Grid container item spacing={2} style={{ background: index % 2 ? '#F2F2F2' : 'white' }}>
                                <Grid container item direction='column' spacing={1} style={{ width: '85%' }}>
                                    <Grid item>
                                        <TextField variant='outlined'
                                            label={'Hard Deadline ' + (index + 1)}
                                            value={milestone.name || ''}
                                            onChange={event => setMilestoneName(index, event)}
                                            fullWidth />
                                    </Grid>
                                    <Grid item>
                                        <TextField variant='outlined'
                                            label='Date'
                                            type='date'
                                            value={milestone.date}
                                            onChange={event => setMilestoneDeadline(index, event)}
                                            fullWidth />
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <ButtonBase onClick={() => deleteMilestone(index)}>
                                        <Delete style={{ fontSize: '2.5em' }} />
                                    </ButtonBase>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid container item justify='flex-end' spacing={2} alignItems='center'>
                            <Grid item>
                                <ButtonBase>
                                    <Box color={theme.palette.primary[500]}>
                                        Discard Changes
                                </Box>
                                </ButtonBase>
                            </Grid>
                            <Grid item>
                                <ButtonBase onClick={submitProject}>
                                    <Box className={classes.doneButton}>
                                        Done!
                                </Box>
                                </ButtonBase>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
        </>
    );
}

CreateProject.propTypes = {
    dispatch: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        project: state.projects.createProject,
        user: state.user,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        // dispatching plain actions
        updateTitle: (event) => dispatch(setNewProjectTitle(event.target.value)),
        addMilestone: () => dispatch(addNewProjectMilestone()),
        deleteMilestone: (index) => dispatch(deleteNewProjectMilestone(index)),
        setMilestoneName: (index, event) => dispatch(setNewProjectMilestoneName(index, event.target.value)),
        setMilestoneDeadline: (index, event) => dispatch(setNewProjectMilestoneDeadline(index, event.target.value)),
        addMember: (name, email) => dispatch(addNewProjectMember(name, email)),
        submitProject: () => dispatch(submitNewProject()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateProject));
