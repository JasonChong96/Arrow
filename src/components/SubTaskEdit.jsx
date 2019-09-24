import React, { useState } from 'react';
import { withStyles, Grid, TextField, Collapse, ButtonBase, Box, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Delete from '@material-ui/icons/DeleteOutlined';
import MembersList from './MembersList';
import SelectMembers from './SelectMembers';

const styles = {

};

function SubTaskEdit({ classes, index, subtask, collapsible, members }) {
    const [expanded, setExpanded] = useState(!collapsible);
    return <Grid container item direction='column' spacing={1} style={{ background: index % 2 ? 'white' : '#F2F2F2' }}>
        <Grid container alignItems='center' spacing={1}>
            <Grid item style={{ width: '66%' }}>
                <TextField variant='outlined'
                    label={'Sub-task ' + index}
                    fullWidth
                    value={subtask.title || ''} />
            </Grid>
            {collapsible && <Grid item>
                <ButtonBase>
                    {expanded ?
                        <ExpandLessIcon style={{ fontSize: '3em' }}
                            onClick={() => setExpanded(!expanded)} />
                        : <ExpandMoreIcon style={{ fontSize: '3em' }}
                            onClick={() => setExpanded(!expanded)} />}
                </ButtonBase>
            </Grid>}
            <Grid item>
                <ButtonBase>
                    <Delete style={{ fontSize: '3em' }} />
                </ButtonBase>
            </Grid>
        </Grid>
        <Collapse in={expanded} style={{ width: '100%', paddingBottom: '1em' }}>
            <Box border='1px solid #E0E0E0' height={0} width='85%' margin='1em auto 0 auto' />
            <Grid container direction='column' spacing={2}>
                <Grid item style={{ paddingTop: '2em' }}>
                    <TextField
                        variant='outlined'
                        label='Description'
                        fullWidth
                        multiline
                        value={subtask.description || ''} >
                    </TextField>
                </Grid>
                <Grid item>
                    <TextField
                        variant='outlined'
                        label='Deadline'
                        type='date'
                        fullWidth
                        value={subtask.deadline || ''} >
                    </TextField>
                </Grid>
                <Grid container item direction='column' spacing={1}>
                    <Grid item>
                        <Box fontSize={12}>
                            I/Cs
                        </Box>
                    </Grid>
                    <Grid container item spacing={1}>
                        <SelectMembers members={members}
                            isChosen={(member) => subtask.assignees.find(assignee => assignee.email == member.email)} />
                    </Grid>
                </Grid>
            </Grid>
        </Collapse>
    </Grid>
}

SubTaskEdit.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

SubTaskEdit.defaultProps = {
    collapsible: true,
}

export default withStyles(styles)(SubTaskEdit);
