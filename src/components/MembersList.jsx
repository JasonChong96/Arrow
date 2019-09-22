import React from 'react';
import { Grid, Box, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountIcon from '@material-ui/icons/AccountCircle';


const styles = {
}

function MembersList({ classes, members }) {
    return members.map(member => (
        <Grid container item direction='column' style={{ width: 'auto' }} alignItems='center'>
            <Grid item>
                <AccountIcon style={{ fontSize: "3em" }} />
            </Grid>
            <Box fontSize={12}>
                {member.name}
            </Box>
        </Grid>
    ))
}

MembersList.propTypes = {
    members: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MembersList);

