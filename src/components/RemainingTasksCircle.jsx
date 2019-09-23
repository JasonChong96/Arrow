import React from 'react';
import { Grid, Box, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import theme from '../modules/theme';
import { red } from '@material-ui/core/colors';


const styles = {
    numberMargin: {
        marginTop: '-8px'
    },

    root: {
        padding: 10,
        margin: 20,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyItems: "start",
        borderRadius: "50%",
        width: 46,
        height: 46,
    },
}

function RemainingTasksCircle({ classes, tasksLeft, overdue }) {
    return <div className={classes.root} style={{
        backgroundColor: overdue ? red[500] : '#F0F0F0',
        color: overdue ? 'white' : '#4F4F4F',
    }}>
        <Grid item className={classes.numberMargin}>
            <Box fontSize={20}>
                {tasksLeft}
            </Box>
        </Grid>
        <Grid item>
            <Box fontSize={12}>
                Left
            </Box>
        </Grid>
    </div>
}

RemainingTasksCircle.propTypes = {
    tasksLeft: PropTypes.number.isRequired,
    overdue: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(RemainingTasksCircle);

