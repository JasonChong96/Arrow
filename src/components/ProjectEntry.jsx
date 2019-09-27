import React, { useState } from 'react';
import {
  withStyles,
  Grid,
  Box,
  Chip,
  ButtonBase,
  Card,
  CardContent,
  Collapse,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import TickIcon from '@material-ui/icons/Done';
import red from '@material-ui/core/colors/red';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import theme from '../modules/theme';
import CircleOutlined from './CircleOutlined';
import MembersList from './MembersList';
import CircleIcon from './CircleIcon';
import { push } from '../modules/history';
import { getShortDayString, getMonthString, daysBetween } from '../modules/helpers';

const styles = {
  chipMilestone: {
    background: theme.palette.primary[700],
    color: theme.palette.primary[50],
    borderRadius: '16px',
    fontSize: '14px',
  },
  monthWrapper: {
    padding: '1em 0 1em 0',
  },
  monthWidth: {
    width: '15%',
  },
  dateWrapper: {
    width: '15%',
  },
  timelineWrapper: {
    width: 'auto',
  },
  detailsWrapper: {
    flexGrow: 1,
  },
  milestoneWrapper: {
    margin: '2em 0 2em 0',
  },
  entryTitleWrapper: {
    flexGrow: 1,
  },
  expandIcon: {
    fontSize: '1.5em',
  },
};

function ProjectDetails({ classes, entry, renderMonth, code, renderDate, setCompletion, online }) {
  const isOverdue = entry.deadline < new Date() && !entry.completed;
  const [expanded, setExpanded] = useState(!entry.completed);
  const isTask = entry.subtasks;
  return (
    <>
      {renderMonth && (
        <Grid container item spacing={2} className={classes.monthWrapper}>
          <Grid item className={classes.monthWidth} />
          <Box fontWeight="bold" fontSize="1.25em" color="#828282" padding='1em 0 1em 0'>
            {getMonthString(new Date(entry.deadline).getMonth())}
          </Box>
        </Grid>
      )}
      <Grid container item spacing={2}>
        <Grid container item direction="column" alignItems="center" className={classes.dateWrapper}>
          {renderDate && (
            <>
              <Box fontSize={20} color={entry.isMilestone ? theme.palette.primary[600] : '#4F4F4F'}>
                {entry.deadline.getDate
                  ? entry.deadline.getDate()
                  : new Date(entry.deadline).getDate()}
              </Box>
              <Box fontSize={18} color={entry.isMilestone ? theme.palette.primary[500] : '#B2B2B2'}>
                {getShortDayString(
                  entry.deadline.getDay
                    ? entry.deadline.getDay()
                    : new Date(entry.deadline).getDay(),
                )}
              </Box>
            </>
          )}
        </Grid>
        <Grid
          container
          item
          className={classes.timelineWrapper}
          direction="column"
          alignItems="center"
        >
          <Box
            flexGrow={entry.isMilestone ? 1 : 0.2}
            width={0}
            border="1px solid #DADADA"
            background="#DADADA"
            marginTop="-0.25em"
          />
          <Box padding="0.25em 0.25em 0.25em 0.25em" />
          <ButtonBase
            onClick={() => (online && !entry.isMilestone ? setCompletion(entry.id, !entry.completed, !isTask, code) : 0)}
          >
            {!entry.completed ? (
              <CircleOutlined color={isOverdue ? red[500] : '#DADADA'} />
            ) : (
                <CircleIcon Icon={TickIcon} />
              )}
          </ButtonBase>
          <Box padding="0.25em 0.25em 0.25em 0.25em" />
          <Box
            flexGrow={1}
            width={0}
            border="1px solid #DADADA"
            background="#DADADA"
            marginBottom="-0.25em"
          />
        </Grid>
        <Grid item className={classes.detailsWrapper}>
          {entry.isMilestone && (
            <>
              <Grid container alignItems="center" className={classes.milestoneWrapper}>
                <Chip label={entry.name} className={classes.chipMilestone} />

                <Box
                  color={theme.palette.primary[600]}
                  flexGrow={1}
                  textAlign="end"
                  marginRight="1em"
                >
                  {entry.tasksLeft} Tasks Left
                </Box>
              </Grid>
            </>
          )}
          {!entry.isMilestone && (
            <Card raised style={{ width: '100%', borderLeft: `4px solid ${entry.color}` }}>
              <CardContent
                onClick={() => {
                  if (entry.completed) {
                    setExpanded(!expanded);
                  } else if (!online) {
                  } else if (isTask) {
                    push(`/project/${code}/tasks/${entry.id}`);
                  } else {
                    push(`/project/${code}/tasks/${entry.taskid}/subtasks/${entry.id}`);
                  }
                }}
              >
                <Grid container direction="column" spacing={1}>
                  <Grid container item spacing={1} alignItems="center">
                    <Grid item className={classes.entryTitleWrapper}>
                      <Box fontSize={16}>{entry.title}</Box>
                    </Grid>
                    {!entry.completed &&
                      new Date().getTime() < new Date(entry.deadline).getTime() &&
                      entry.milestones.length > 0 && (
                        <Grid item justify="flex-end">
                          <Chip
                            label={entry.milestones[0].name}
                            className={classes.chipMilestone}
                          />
                        </Grid>
                      )}
                    {!entry.completed && new Date().getTime() > new Date(entry.deadline).getTime() && (
                      <Grid item justify="flex-end">
                        <Box color="red">
                          {daysBetween(entry.deadline, new Date())} DAY
                          {daysBetween(entry.deadline, new Date()) == 1 ? '' : 'S'}
                        </Box>
                      </Grid>
                    )}
                    {entry.completed && entry.milestones && (
                      <Grid item justify="flex-end">
                        {expanded ? (
                          <ExpandLessIcon className={classes.expandIcon} />
                        ) : (
                            <ExpandMoreIcon className={classes.expandIcon} />
                          )}
                      </Grid>
                    )}
                  </Grid>
                  <Collapse in={expanded}>
                    <Grid item>
                      <Box color="rgba(0,0,0,0.6)" fontSize="0.875em">
                        {entry.description}
                      </Box>
                    </Grid>
                    <Grid item container>
                      <MembersList members={entry.assignees} />
                    </Grid>
                  </Collapse>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </>
  );
}

ProjectDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  code: PropTypes.string.isRequired,
  entry: PropTypes.object.isRequired,
  online: PropTypes.bool.isRequired,
  renderDate: PropTypes.bool.isRequired,
  renderMonth: PropTypes.bool.isRequired,
  setCompletion: PropTypes.func.isRequired,
};

export default withStyles(styles)(ProjectDetails);
