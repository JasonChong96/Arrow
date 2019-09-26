import React, { useState, useEffect } from 'react';
import { withStyles, Grid, Button, Container, Paper, Box, TextField, ButtonBase, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import theme from '../modules/theme';
import Header from '../components/Header';
import { setNewProjectTitle, addNewProjectMilestone, setNewProjectMilestoneName, setNewProjectMilestoneDeadline, addNewProjectMember, deleteNewProjectMilestone, submitNewProject, loadProjectForEdit, deleteProject, loadProject, resetNewProject, patchProject, expelMembers } from '../actions';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Delete from '@material-ui/icons/DeleteOutlined';
import NumberCircle from '../components/NumberCircle';
import MembersList from '../components/MembersList';
import { push } from '../modules/history';
import Loader from '../components/Loader';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ListDialog from '../components/ListDialog';

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

const copyToClipboard = (text) => {
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
}

function HeaderComponent({ classes, updateTitle, project, removedMembers, onClickDelete, onClickAdd, allowAdd, onClickRemove }) {
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
                <Button onClick={onClickDelete}>
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
                    <Button onClick={onClickRemove} style={{ textTransform: 'none', color: 'white', fontSize: 12 }}>
                        Remove
            </Button>
                </Box>
            </Grid>
            <Grid container item alignItems='center' spacing={1} direction='row' style={{ overflowX: 'auto' }}>
                <MembersList members={project.members.filter(member => !removedMembers.includes(member.email))} />
                {allowAdd && <Grid container item direction='column' style={{ width: 'auto' }} alignItems='center'>
                    <Grid item>
                        <ButtonBase style={{ display: 'inline-block' }} onClick={onClickAdd}>
                            <AddIcon style={{ fontSize: 48 }} />
                        </ButtonBase>
                    </Grid>
                    <Box fontSize={12}>
                        <br />
                    </Box>
                </Grid>}
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
    submitProject,
    patchProject,
    loadProjectForEdit,
    deleteProject,
    projects,
    loadProject,
    resetProject,
    expelMembers,
    match: { params: { code } }, }) {
    useEffect(() => {
        if (code) {
            if (projects[code]) {
                loadProjectForEdit(code);
            } else {
                loadProject(code);
            }
        } else {
            resetProject()
            addMember(user.displayName, user.email);
        }
    }, [projects[code]])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [copyDialogOpen, setCopyDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [removedMembers, setRemovedMembers] = useState([]);
    if (code && !projects[code]) {
        return <Loader />
    }
    return (
        <>
            <Header contentComponent={HeaderComponent} backPath={'/projects'} height='16em' color={theme.palette.primary[700]} headerProps={{
                classes, updateTitle, project, onClickDelete: () => setDeleteDialogOpen(true),
                onClickAdd: () => {
                    copyToClipboard(('' + window.location.href).replace('/edit', '/join/' + encodeURIComponent(project.project.title)));
                    setCopyDialogOpen(true)
                },
                allowAdd: project.project.code,
                onClickRemove: () => setRemoveDialogOpen(true),
                removedMembers,
            }} />
            <Paper className={classes.paperRoot}>
                <Container maxWidth='sm' style={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid container direction='column' spacing={5} style={{ width: '95%' }}>
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
                        <Grid container item spacing={3} direction='column' style={{ maxHeight: '50vh', flexWrap: 'nowrap', overflowY: 'auto' }}>
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
                        </Grid>
                        <Grid container item justify='flex-end' spacing={2} alignItems='center'>
                            <Grid item>
                                <Link to={code ? '/project/' + code : '/projects'}>
                                    <ButtonBase>
                                        <Box color={theme.palette.primary[500]}>
                                            Discard Changes
                                </Box>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                            <Grid item>
                                <ButtonBase onClick={() => code ? patchProject() : submitProject()}>
                                    <Box className={classes.doneButton}>
                                        Done!
                                </Box>
                                </ButtonBase>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
            <ConfirmationDialog open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => {
                    setDeleteDialogOpen(false);
                    if (code) {
                        deleteProject(code);
                    } else {
                        push('/projects');
                    }
                }}
                title='Delete Project?'
                content={() => <> Are you sure you want to PERMANENTLY delete this project, along with its tasks and subtasks?
                    <br />
                    <br />
                    This action is IRREVERSIBLE.</>}
                cancelText='No, Go Back'
                confirmText='Yes, Delete Project'
            />
            <Dialog open={copyDialogOpen} onClose={() => setCopyDialogOpen(false)}>
                <DialogTitle>
                    Add Members
                </DialogTitle>
                <DialogContent>
                    Link to Project '{project.project.title}' has been copied!
                    <br />
                    <br />
                    Share it with your team mates to add them in.
                </DialogContent>
                <DialogActions>
                    <ButtonBase onClick={() =>
                        setCopyDialogOpen(false)
                    }
                        className={classes.doneButton}>
                        Got it!
                    </ButtonBase>
                </DialogActions>
            </Dialog>
            <ListDialog open={removeDialogOpen}
                title='Remove Members'
                entries={project.members.filter(member => !removedMembers.includes(member.email))}
                getLabel={member => member.name}
                canRemove={member => member.email != user.email}
                onRemove={(member) => {
                    const newArr = [...removedMembers];
                    newArr.push(member.email);
                    return setRemovedMembers(newArr);
                }}
                onClose={() => setRemoveDialogOpen(false)}
                onConfirm={() => {
                    expelMembers(code, removedMembers);
                    setRemoveDialogOpen(false);
                }}
            />
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
        projects: state.projects.projects,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        updateTitle: (event) => dispatch(setNewProjectTitle(event.target.value)),
        addMilestone: () => dispatch(addNewProjectMilestone()),
        deleteMilestone: (index) => dispatch(deleteNewProjectMilestone(index)),
        setMilestoneName: (index, event) => dispatch(setNewProjectMilestoneName(index, event.target.value)),
        setMilestoneDeadline: (index, event) => dispatch(setNewProjectMilestoneDeadline(index, event.target.value)),
        addMember: (name, email) => dispatch(addNewProjectMember(name, email)),
        submitProject: () => dispatch(submitNewProject()),
        loadProjectForEdit: (code) => dispatch(loadProjectForEdit(code)),
        deleteProject: (code) => dispatch(deleteProject(code)),
        loadProject: code => dispatch(loadProject(code)),
        resetProject: () => dispatch(resetNewProject()),
        patchProject: () => dispatch(patchProject()),
        expelMembers: (code, members) => dispatch(expelMembers(code, members)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateProject));
