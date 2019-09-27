import React, { useState } from 'react';
import { withStyles, Grid, TextField, Collapse, ButtonBase, Box, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Delete from '@material-ui/icons/DeleteOutlined';
import SelectMembers from './SelectMembers';

const styles = {
  icon: {
    fontSize: '3em',
  },
  titleWrapper: {
    width: '66%',
  },
  detailsWrapper: {
    width: '100%',
    paddingBottom: '1em',
  },
  descriptionWrapper: {
    paddingTop: '2em',
  },
};

function SubTaskEdit({
  classes,
  index,
  subtask,
  collapsible,
  members,
  setTitle,
  setDescription,
  setDeadline,
  setAssignees,
  deleteSubTask,
}) {
  const [expanded, setExpanded] = useState(!collapsible);
  const isAssignee = member => subtask.assignees.find(assignee => assignee.email == member.email);
  return (
    <Grid
      container
      item
      direction="column"
      spacing={1}
      style={{ background: index % 2 ? '#F2F2F2' : 'white' }}
    >
      <Grid container alignItems="center" spacing={1}>
        <Grid item className={classes.titleWrapper}>
          <TextField
            variant="outlined"
            label={`Sub-task ${index + 1}`}
            fullWidth
            value={subtask.title || ''}
            onChange={setTitle}
          />
        </Grid>
        {collapsible && (
          <Grid item>
            <ButtonBase>
              {expanded ? (
                <ExpandLessIcon className={classes.icon} onClick={() => setExpanded(!expanded)} />
              ) : (
                <ExpandMoreIcon className={classes.icon} onClick={() => setExpanded(!expanded)} />
              )}
            </ButtonBase>
          </Grid>
        )}
        <Grid item>
          <ButtonBase onClick={deleteSubTask}>
            <Delete className={classes.icon} />
          </ButtonBase>
        </Grid>
      </Grid>
      <Collapse in={expanded} className={classes.detailsWrapper}>
        <Box border="1px solid #E0E0E0" height={0} width="85%" margin="1em auto 0 auto" />
        <Grid container direction="column" spacing={2}>
          <Grid item className={classes.descriptionWrapper}>
            <TextField
              variant="outlined"
              label="Description"
              fullWidth
              multiline
              value={subtask.description || ''}
              onChange={setDescription}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Deadline"
              type="date"
              fullWidth
              value={subtask.deadline || ''}
              onChange={setDeadline}
            />
          </Grid>
          <Grid container item direction="column" spacing={1}>
            <Grid item>
              <Box fontSize={12}>I/Cs</Box>
            </Grid>
            <Grid container item spacing={1}>
              <SelectMembers
                members={members}
                isChosen={isAssignee}
                onChoose={member =>
                  setAssignees(
                    isAssignee(member)
                      ? subtask.assignees.filter(assignee => assignee.email != member.email)
                      : [...subtask.assignees].concat([member]),
                  )
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Collapse>
    </Grid>
  );
}

SubTaskEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  collapsible: PropTypes.bool.isRequired,
  deleteSubTask: PropTypes.func.isRequired,
  index: PropTypes.number,
  members: PropTypes.array.isRequired,
  setAssignees: PropTypes.func.isRequired,
  setDeadline: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  subtask: PropTypes.object.isRequired,
};

SubTaskEdit.defaultProps = {
  collapsible: true,
};

export default withStyles(styles)(SubTaskEdit);
