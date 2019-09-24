import React from 'react';
import { Grid, Box, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import theme from '../modules/theme';


const styles = {
    numberMargin: {
        marginTop: '-8px'
    },

    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyItems: "start",
        borderRadius: "50%",
    },
}

function CircleIcon({ classes, Icon, length, color, iconColor, opacity, padding }) {
    return <div className={classes.root} style={{
        backgroundColor: color,
        color: 'white',
        height: length,
        width: length,
        opacity: opacity,
        padding: padding,
    }}>
        <Icon style={{ color: iconColor }} />
    </div>
}

CircleIcon.propTypes = {
    tasksLeft: PropTypes.number.isRequired,
    overdue: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
}

CircleIcon.defaultProps = {
    length: 16,
    color: theme.palette.primary[500],
    opacity: 1,
    padding: 1,
}

export default withStyles(styles)(CircleIcon);

