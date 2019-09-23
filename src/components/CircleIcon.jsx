import React from 'react';
import { Grid, Box, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import theme from '../modules/theme';


const styles = {
    numberMargin: {
        marginTop: '-8px'
    },

    root: {
        padding: '1px',
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyItems: "start",
        borderRadius: "50%",
        width: 16,
        height: 16,
    },
}

function CircleIcon({ classes, Icon }) {
    return <div className={classes.root} style={{
        backgroundColor: theme.palette.primary[500],
        color: 'white',
    }}>
        <Icon />
    </div>
}

CircleIcon.propTypes = {
    tasksLeft: PropTypes.number.isRequired,
    overdue: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CircleIcon);

