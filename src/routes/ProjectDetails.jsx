import React, { useState, useEffect } from 'react';
import { withStyles, Grid, Button, Typography, Container, Paper, Box, Chip, Switch, TextField, ButtonBase, Card, CardContent } from '@material-ui/core';
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
import ProjectEntry from '../components/ProjectEntry';

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

const project = {
    "project": {
        "code": "G0pQi7",
        "title": "CS3216 Assignment 3",
        "deadline": new Date("2019-12-25T00:00:00.207Z")
    },
    "milestones": [
        {
            "name": "Final week",
            "date": new Date("2019-12-25T00:00:00.207Z")
        }
    ],
    "members": [
        {
            "email": "johnsmith@gmail.com",
            "name": "John Smith"
        }
    ],
    "tasks": [
        {
            "id": "pH1qRj8",
            "title": "Submit assignment 3",
            "description": "Progressive web app",
            "color": "#ff0000",
            "deadline": new Date("2020-01-29T00:00:00.207Z"),
            "completed": true,
            "assignees": [
                {
                    "email": "johnsmith@gmail.com",
                    "name": "John Smith"
                }
            ],
            "milestones": [
                {
                    "name": "Final week",
                    "date": new Date("2019-12-31T00:00:00.207Z")
                }
            ],
            "subtasks": [
                {
                    "id": "qI2rSk9",
                    "title": "Write API documentation",
                    "description": "Use Apiary",
                    "deadline": new Date("2019-12-24T00:00:00.207Z"),
                    "completed": false,
                    "assignees": [
                        {
                            "email": "johnsmith@gmail.com",
                            "name": "John Smith"
                        }
                    ]
                }
            ]
        }
    ]
}

function ProjectDetails({ classes, match: { params: { code } } }) {
    var subTasks = [];
    project.tasks.forEach(task => {
        task.subtasks.forEach(subtask => {
            subTasks.push({
                ...subtask,
                color: task.color,
            })
        })
    })
    var allTasksAndSubtasks = subTasks.concat(project.tasks)
    allTasksAndSubtasks = allTasksAndSubtasks.concat(project.milestones.map(milestone => ({
        name: milestone.name,
        deadline: milestone.date,
        isMilestone: true,
    })))
    allTasksAndSubtasks.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
    var curMonth = new Date().getMonth();
    const upcomingMilestone = allTasksAndSubtasks.find(entry => entry.isMilestone && entry.deadline > new Date());
    const headerComponent = () =>
        <Grid container direction='column' spacing={2}>
            <Grid container item>
                <Box fontSize={24} color='black' flexGrow='0.9'>
                    {project.project.title}
                </Box>
                <Box alignSelf='flex-end' color='black'>
                    <ButtonBase>
                        <EditIcon style={{ fontSize: '3em' }} />
                    </ButtonBase>
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
                            <Grid item>
                                <RemainingTasksCircle tasksLeft={4} overdue={false} />
                            </Grid>
                        </Grid>
                        {allTasksAndSubtasks.map(entry => {
                            const entryMonth = entry.deadline.getMonth();
                            const renderMonth = entryMonth != curMonth;
                            curMonth = entryMonth;
                            return <ProjectEntry entry={entry} renderMonth={renderMonth} />
                        })}
                    </Grid>
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
    };
}

export default connect(mapStateToProps)(withStyles(styles)(ProjectDetails));
