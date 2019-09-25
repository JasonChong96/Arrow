import React, { useState, useEffect } from 'react';
import { withStyles, Grid, Button, Typography, Container, Paper, Box, Chip, Switch, TextField, ButtonBase, Card, CardContent, Collapse } from '@material-ui/core';
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
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { push } from '../modules/history';

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


function getDayString(day) {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    return days[day];
}

function getMonthString(month) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[month];
}

function daysTill(date2) {
    const date1 = new Date();
    const timeDiff = date2.getTime() - date1.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return Math.floor(daysDiff);
}

function ProjectDetails({ classes, entry, renderMonth, code, renderDate, setCompletion }) {
    const isOverdue = entry.deadline < new Date() && !entry.completed;
    const [expanded, setExpanded] = useState(!entry.completed);
    const isTask = entry.subtasks;
    return <>
        {renderMonth && <Grid container item spacing={2} style={{ padding: '1em 0 1em 0' }}>
            <Grid item style={{ width: '15%' }} />
            <Box fontWeight='bold' fontSize='1.25em' color='#828282'>
                {getMonthString(entry.deadline.getMonth())}
            </Box>
        </Grid>}
        <Grid container item spacing={2} >
            <Grid container item direction='column' alignItems='center' style={{ width: '15%' }}>
                {renderDate && <>
                    <Box fontSize={20} color={entry.isMilestone ? theme.palette.primary[600] : '#4F4F4F'}>
                        {entry.deadline.getDate()}
                    </Box>
                    <Box fontSize={18} color={entry.isMilestone ? theme.palette.primary[500] : '#B2B2B2'}>
                        {getDayString(entry.deadline.getDay())}
                    </Box>
                </>}
            </Grid>
            <Grid container item style={{ width: 'auto' }} direction='column' alignItems='center'>
                <Box flexGrow={entry.isMilestone ? 1 : 0.2} width={0} border='1px solid #DADADA' background='#DADADA' marginTop='-0.25em' />
                <Box padding='0.25em 0.25em 0.25em 0.25em' />
                <ButtonBase onClick={() => setCompletion(entry.id, !entry.completed, !isTask, code)}>
                    {!entry.completed ? <CircleOutlined color={isOverdue ? red[500] : '#DADADA'} />
                        : <CircleIcon Icon={TickIcon} />}
                </ButtonBase>
                <Box padding='0.25em 0.25em 0.25em 0.25em' />
                <Box flexGrow={1} width={0} border='1px solid #DADADA' background='#DADADA' marginBottom='-0.25em' />
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
                {entry.isMilestone &&
                    <>
                        <Grid container alignItems='center' style={{ margin: '2em 0 2em 0' }}>

                            <Chip label={entry.name} className={classes.chipMilestone} />

                            <Box color={theme.palette.primary[600]} flexGrow={1} textAlign='end' marginRight='1em'>
                                2 Tasks Left
                                                    </Box>
                        </Grid>
                    </>
                }
                {!entry.isMilestone && <Card raised style={{ width: '100%', borderLeft: '4px solid ' + entry.color }}>
                    <CardContent onClick={() => {
                        if (entry.completed) {
                            setExpanded(!expanded);
                        } else if (isTask) {
                            push('/project/' + code + '/tasks/' + entry.id);
                        } else {
                            push('/project/' + code + '/tasks/' + entry.taskid + '/subtasks/' + entry.id);
                        }
                    }}>
                        <Grid container direction='column' spacing={1}>
                            <Grid container item spacing={1} alignItems='center'>
                                <Grid item style={{ flexGrow: 1 }}>
                                    <Box fontSize={16}>
                                        {entry.title}
                                    </Box>
                                </Grid>
                                {!entry.completed && entry.milestones.length > 0 && <Grid item justify='flex-end'>
                                    <Chip label={entry.milestones[0].name} className={classes.chipMilestone} />
                                </Grid>}
                                {entry.completed && entry.milestones && <Grid item justify='flex-end'>
                                    {expanded ? <ExpandLessIcon style={{ fontSize: '1.5em' }} />
                                        : <ExpandMoreIcon style={{ fontSize: '1.5em' }} />}
                                </Grid>}
                            </Grid>
                            <Collapse in={expanded}>
                                <Grid item>
                                    <Box color='rgba(0,0,0,0.6)' fontSize='0.875em'>
                                        {entry.description}
                                    </Box>
                                </Grid>
                                <Grid item container>
                                    <MembersList members={entry.assignees} />
                                </Grid>
                            </Collapse>
                        </Grid>
                    </CardContent>
                </Card>}
            </Grid>
        </Grid>
    </>
}

ProjectDetails.propTypes = {
    dispatch: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        projects: state.projects.projects,
    };
}

export default connect(mapStateToProps)(withStyles(styles)(ProjectDetails));
