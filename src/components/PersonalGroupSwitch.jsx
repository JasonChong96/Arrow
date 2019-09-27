import React from 'react';
import { withStyles, Grid, Switch } from '@material-ui/core';
import PropTypes from 'prop-types';

import Person from '@material-ui/icons/Person';
import People from '@material-ui/icons/People';

const styles = {
  switchIcon: {
    color: 'black',
    fontSize: '1.5em',
  },
  switch: {
    color: 'white',
  },
};

function PersonalGroupSwitch({ classes, checked, onChange }) {
  return (
    <Grid component="label" container alignItems="center">
      <Grid item>
        <Person className={classes.switchIcon} />
      </Grid>
      <Grid item>
        <Switch checked={checked} onChange={onChange} className={classes.switch} />
      </Grid>
      <Grid item>
        <People className={classes.switchIcon} />
      </Grid>
    </Grid>
  );
}

PersonalGroupSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(PersonalGroupSwitch);
