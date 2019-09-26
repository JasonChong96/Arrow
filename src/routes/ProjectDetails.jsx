import React, { useState, useEffect } from 'react';
import { withStyles, Grid, Button, Typography, Container, Paper, Box, Chip, Switch, TextField, ButtonBase, Card, CardContent, DialogTitle, DialogActions, Dialog } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import UserTextField from '../components/UserTextField';
import theme from '../modules/theme';
import PasswordField from '../components/PasswordField';
import Header from '../components/Header';
import TitleOnlyHeader from '../components/TitleOnlyHeader';
import { loadProjects, loadProject, setTaskCompletion } from '../actions';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Person from '@material-ui/icons/Person';
import People from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/EditOutlined';
import TickIcon from '@material-ui/icons/Done';
import Project from '../components/Project';
import { Link } from 'react-router-dom';
import Delete from '@material-ui/icons/DeleteOutlined';
import NumberCircle from '../components/NumberCircle';
import RemainingTasksCircle from '../components/RemainingTasksCircle';
import CircleOutlined from '../components/CircleOutlined';
import MembersList from '../components/MembersList';
import red from '@material-ui/core/colors/red';
import CircleIcon from '../components/CircleIcon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowRightIcon from '@material-ui/icons/ArrowForwardIos';
import ProjectEntry from '../components/ProjectEntry';
import Loader from '../components/Loader';
import PersonalGroupSwitch from '../components/PersonalGroupSwitch';

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
        boxShadow: '0px -1px 5px rgba(0, 0, 0, 0.2), 0px -2px 5px rgba(0, 0, 0, 0.12), 0px 0px 5px rgba(0, 0, 0, 0.14)',
    },
};

function getMonthString(month) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[month];
}

function daysTill(date) {
    const date2 = date.getTime ? date : new Date(date);
    const date1 = new Date();
    const timeDiff = date2.getTime() - date1.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return Math.floor(daysDiff);
}

function containsMilestone(task, milestone) {
    return task.milestones.find(milestone2 => milestone.id == milestone2.id);
}

function isTaskAssignedTo(task, member) {
    return task.assignees.find(assignee => assignee.email == member.email);
}

function ProjectDetails({ classes, online, loadProject, projects, setCompletion, user, match: { params: { code } } }) {
    const [dialogState, setDialogState] = useState(0);
    const [showPersonalOnly, setShowPersonalOnly] = useState(false);
    useEffect(() => {
        loadProject(code);
    }, [])
    const project = projects[code]
    if (!project) {
        return <Loader />
    }
    var subTasks = [];
    project.tasks.forEach(task => {
        task.subtasks.forEach(subtask => {
            subTasks.push({
                ...subtask,
                color: task.color,
                milestones: task.milestones,
                taskid: task.id,
            })
        })
    })
    var allTasksAndSubtasks = subTasks.concat(project.tasks)
    const personalLeft = allTasksAndSubtasks.reduce((a, b) =>
        (a + ((!b.completed && isTaskAssignedTo(b, user)) ? 1 : 0)), 0);
    const teamLeft = allTasksAndSubtasks.reduce((a, b) =>
        (a + (b.completed ? 0 : 1)), 0);
    if (showPersonalOnly) {
        allTasksAndSubtasks = allTasksAndSubtasks.filter(entry => isTaskAssignedTo(entry, user));
    }
    allTasksAndSubtasks = allTasksAndSubtasks.concat(project.milestones.map(milestone => ({
        name: milestone.name,
        deadline: milestone.date,
        tasksLeft: project.tasks.reduce((a, b) =>
            (a + ((!b.completed && containsMilestone(b, milestone) && (!showPersonalOnly || isTaskAssignedTo(b, user))) ? (1 + b.subtasks.length) : 0)), 0),
        isMilestone: true,
    })))
    allTasksAndSubtasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    var curMonth = new Date().getMonth();
    var prevDate = -1;
    const upcomingMilestone = allTasksAndSubtasks.find(entry => entry.isMilestone && entry.deadline > new Date());
    const headerComponent = () =>
        <Grid container direction='column' spacing={2}>
            <Grid container item>
                <Box fontSize={24} color='black' flexGrow='0.9'>
                    {project.project.title}
                </Box>
                <Box alignSelf='flex-end' color='black'>
                    <Link to={'/project/' + code + '/edit'}>
                        <ButtonBase>
                            <EditIcon style={{ fontSize: '3em', color: 'black' }} />
                        </ButtonBase>
                    </Link>
                </Box>
            </Grid>
            <Grid container item alignItems='center'>
                <Box fontSize={20} color='#4F4F4F' marginRight='1em'>
                    {getMonthString(new Date().getMonth())}
                </Box>
                {upcomingMilestone && <>
                    <Box fontSize={14} color='#4F4F4F' marginRight='0.5em'>
                        {daysTill(upcomingMilestone.deadline)} Days till
                    </Box>
                    <Chip label={upcomingMilestone.name} className={classes.chipMilestone} />
                </>}
            </Grid>
        </Grid >
    return (
        <>
            <Header contentComponent={headerComponent} backPath={'/projects'} height='10em' />
            <Paper className={classes.paperRoot}>
                <Container maxWidth='sm' style={{ paddingBottom: '2em' }}>
                    <Grid container direction='column' spacing={1}>
                        <Grid container item alignItems='center'>
                            <Grid item style={{ width: '45%' }}>
                                <RemainingTasksCircle tasksLeft={showPersonalOnly ? personalLeft : teamLeft} overdue={false} />
                            </Grid>
                            <Grid item style={{ width: '40%' }}>
                                <PersonalGroupSwitch onChange={() => setShowPersonalOnly(!showPersonalOnly)} checked={!showPersonalOnly} />
                            </Grid>
                            {online && <Grid item>
                                <ButtonBase onClick={() => setDialogState(1)}>
                                    <AddIcon style={{ color: theme.palette.primary[500], fontSize: '3em' }} />
                                </ButtonBase>
                            </Grid>}
                        </Grid>
                        {allTasksAndSubtasks.map(entry => {
                            const deadline = entry.deadline.getMonth ? entry.deadline : new Date(entry.deadline);
                            const entryMonth = deadline.getMonth();
                            const entryDate = deadline.getDate();
                            const renderMonth = entryMonth != curMonth;
                            const renderDate = entryDate != prevDate || renderMonth
                            prevDate = entryDate;
                            curMonth = entryMonth;
                            return <ProjectEntry entry={entry} renderMonth={renderMonth} code={code} renderDate={renderDate} setCompletion={setCompletion} online={online} />
                        })}
                    </Grid>
                    <Dialog maxWidth='xs' fullWidth open={dialogState == 1} onClose={() => setDialogState(0)}>
                        <DialogTitle>Add</DialogTitle>
                        <DialogActions>
                            <Grid container direction='column' spacing={1}>
                                <Grid item style={{ width: '100%', }}>
                                    <Link to={online ? '/project/' + code + '/createtask' : undefined} style={{ width: '100%' }}>
                                        <ButtonBase style={{ width: '100%' }}>
                                            <Grid container item alignItems='center' justify='center' spacing={1} style={{ color: 'black', fontSize: '1.25em' }}>
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
                                    <hr style={{
                                        border: '0.5px solid #F2F2F2',
                                        height: '0.5px',
                                        width: '90%',
                                    }} />
                                </Grid>
                                <Grid item>
                                    <ButtonBase style={{ width: '100%' }} onClick={() => setDialogState(2)}>
                                        <Grid container item alignItems='center' justify='center' spacing={1} style={{ color: 'black', fontSize: '1.25em' }}>
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
                    <Dialog maxWidth='xs' fullWidth open={dialogState == 2} onClose={() => setDialogState(0)}>
                        <DialogTitle>Add Sub-Task to</DialogTitle>
                        <DialogActions>
                            <Grid container direction='column' spacing={1}>
                                {project.tasks.map(task => (
                                    <>
                                        <Grid item style={{ width: '100%', }}>
                                            <Link to={'/project/' + code + '/tasks/' + task.id + '/createsubtask'} style={{ width: '100%' }}>
                                                <ButtonBase style={{ width: '100%', borderLeft: '4px solid ' + task.color }}>
                                                    <Grid container item alignItems='center' justify='center' spacing={1} style={{ color: 'black', fontSize: '1.25em' }}>
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
                                            <hr style={{
                                                border: '0.5px solid #F2F2F2',
                                                height: '0.5px',
                                                width: '90%',
                                            }} />
                                        </Grid>
                                    </>))}
                            </Grid>
                        </DialogActions>
                    </Dialog>
                </Container>

            </Paper>
        </>
    );
}

ProjectDetails.propTypes = {
    dispatch: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
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
        setCompletion: (id, completed, isSubTask, code) => dispatch(setTaskCompletion(id, completed, isSubTask, code)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectDetails));
