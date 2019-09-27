import React from 'react';
import { withStyles, Grid, Box, Chip, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { Link } from 'react-router-dom';
import theme from '../modules/theme';
import RemainingTasksCircle from './RemainingTasksCircle';

const styles = {
  chipMilestone: {
    background: theme.palette.primary[700],
    color: theme.palette.primary[50],
    borderRadius: '16px',
    fontSize: '14px',
  },
  leftLabel: {
    width: '0',
    flexGrow: 0.8,
  },
  root: {
    marginLeft: '2em',
    marginRight: '-2em',
    width: 'calc(100% - 2em)',
  },
  daysLeftLabel: {
    opacity: 0.6,
  },
  arrowRight: {
    fontSize: '2em',
    color: 'silver',
  },
};

function Project({ classes, title, daysLeft, milestoneLabel, tasksLeft, overdue, code }) {
  return (
    <Grid container item className={classes.root} alignItems="center">
      <Box flexGrow={0.1} />
      <Grid container item direction="column" className={classes.leftLabel} spacing={1}>
        <Grid container item>
          <Box
            fontWeight={500}
            fontSize={18}
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
            width="100%"
          >
            {title}
          </Box>
        </Grid>
        <Grid container item alignItems="center" spacing={1}>
          {typeof daysLeft !== 'undefined' && milestoneLabel && (
            <>
              <Grid item className={classes.daysLeftLabel}>
                {daysLeft} days till
              </Grid>
              <Grid item>
                <Chip label={milestoneLabel} className={classes.chipMilestone} />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      <Grid item>
        <RemainingTasksCircle tasksLeft={tasksLeft} overdue={overdue} />
      </Grid>
      <Grid item>
        <Link to={`/project/${code}`}>
          <ArrowRight className={classes.arrowRight} />
        </Link>
      </Grid>
    </Grid>
  );
}

Project.propTypes = {
  code: PropTypes.string.isRequired,
  daysLeft: PropTypes.number,
  milestoneLabel: PropTypes.string,
  overdue: PropTypes.bool.isRequired,
  tasksLeft: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(Project);
