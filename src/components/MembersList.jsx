import React from 'react';
import { Grid, Box, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountIcon from '@material-ui/icons/AccountCircle';

const styles = {
  memberWrapper: {
    width: 'auto',
  },
  memberIcon: {
    fontSize: '3em',
  },
};

function MembersList({ classes, members }) {
  return members.map(member => (
    <Grid container item direction="column" className={classes.memberWrapper} alignItems="center">
      <Grid item>
        <AccountIcon className={classes.memberIcon} />
      </Grid>
      <Box fontSize={12}>{member.name}</Box>
    </Grid>
  ));
}

MembersList.propTypes = {
  classes: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
};

export default withStyles(styles)(MembersList);
