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
import { loadProjects } from '../actions';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Person from '@material-ui/icons/Person';
import People from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Project from '../components/Project';
import { Link } from 'react-router-dom';
import Delete from '@material-ui/icons/DeleteOutlined';
import NumberCircle from '../components/NumberCircle';
import MembersList from '../components/MembersList';
import { green, teal, indigo, blue, deepPurple, purple } from '@material-ui/core/colors';
import TickIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SubTaskEdit from '../components/SubTaskEdit';
import SelectMembers from '../components/SelectMembers';
import WhiteLabelTextField from '../components/WhiteLabelTextField';

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
    chipMilestone: {
        background: theme.palette.primary[700],
        color: theme.palette.primary[50],
        borderRadius: '16px',
        fontSize: '14px',
    },
    colorOption: {
        height: '2.55em',
        width: '2.55em',
        borderRadius: '0.375em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

const colors = [
    teal, green, indigo, blue, deepPurple, purple
]

const taskColors = colors.map(color => color[500]);

function getColorScheme(taskColor) {
    return colors.find(color => color[500] == taskColor);
}

function getHeaderColor(task) {
    var colorScheme = getColorScheme(task.color);
    return colorScheme ? colorScheme[700] : '#333333';
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
        },
        {
            "email": "fsmith@gmail.com",
            "name": "Fake Smith"
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

function EditTask({ classes, match: { params: { code, taskid } } }) {
    const task = project.tasks.find(task => task.id == taskid);
    const headerComponent = () =>
        <Grid container direction='column' spacing={2}>
            <Grid container item alignItems='center' spacing={2}>
                <Box flexGrow={1}>
                    <WhiteLabelTextField
                        color='white'
                        variant='filled'
                        label='Task Title'
                        fullWidth />
                </Box>
                <Grid item>
                    <Button>
                        <Delete style={{ fontSize: '4em', color: '#DADADA' }} />
                    </Button>
                </Grid>
            </Grid>
            <Grid container item spacing={2}>
                <Box>
                    <WhiteLabelTextField
                        variant='filled'
                        label='Deadline'
                        onChange={(event) => console.log(event.target.value)}
                        value={task.deadline.toISOString().substring(0, 10) || ''}
                        type='date' />
                </Box>
            </Grid>
            <Grid container item direction='column' spacing={1}>
                <Grid item>
                    <Box color='white' fontSize={12}>
                        I/Cs
                    </Box>
                </Grid>
                <Grid container item spacing={1}>
                    <SelectMembers members={project.members}
                        isChosen={(member) => task.assignees.find(assignee => assignee.email == member.email)} />
                </Grid>
            </Grid>
            <Grid container item direction='column' spacing={1}>
                <Grid item>
                    <Box color='white' fontSize={12}>
                        I/Cs
                    </Box>
                </Grid>
                <Grid container item>
                    {project.milestones.map(milestone => (
                        <Grid item>
                            <Chip label={milestone.name} className={classes.chipMilestone} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid container item direction='column' spacing={1}>
                <Grid item>
                    <Box color='white' fontSize={12}>
                        Colour
                    </Box>
                </Grid>
                <Grid container item spacing={2}>
                    {taskColors.map(color => (
                        <Grid item>
                            <ButtonBase>
                                <Box className={classes.colorOption}
                                    bgcolor={color}
                                    style={{ opacity: task.color == color ? 1 : 0.5 }}>
                                    {task.color == color && <TickIcon />}
                                </Box>
                            </ButtonBase>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid >
    return (
        <>
            <Header contentComponent={headerComponent} backPath={'/project/' + code} height='28em' color={getHeaderColor(task)} backColor='#BDBDBD' />
            <Paper className={classes.paperRoot}>
                <Container maxWidth='sm' style={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid container direction='column' spacing={3} style={{ width: '95%' }}>
                        <Grid container item spacing={2} alignItems='center'>
                            <Grid container item spacing={1} style={{ width: '85%' }} alignItems='center'>
                                <Box fontWeight={500} fontSize='16px'>
                                    Sub-Tasks
                            </Box>
                                <Grid item>
                                    <NumberCircle num={task.subtasks.length} />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <ButtonBase>
                                    <AddIcon style={{ fontSize: '2.5em' }} />
                                </ButtonBase>
                            </Grid>
                        </Grid>
                        {task.subtasks.map((subtask, index) => (
                            <SubTaskEdit subtask={subtask} index={index + 1} members={project.members} />
                        ))}
                    </Grid>
                </Container>
            </Paper>
        </>
    );
}

EditTask.propTypes = {
    dispatch: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        projects: state.projects.projects,
    };
}

export default connect(mapStateToProps)(withStyles(styles)(EditTask));
