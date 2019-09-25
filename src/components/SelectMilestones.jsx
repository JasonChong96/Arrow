import React from 'react';
import { Grid, Box, withStyles, ButtonBase, Chip } from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountIcon from '@material-ui/icons/AccountCircle';
import CircleIcon from './CircleIcon';
import TickIcon from '@material-ui/icons/Done';
import theme from '../modules/theme';


const styles = {
    chipMilestone: {
        background: theme.palette.primary[700],
        color: theme.palette.primary[50],
        borderRadius: '16px',
        fontSize: '14px',
    },
}

function SelectMilestones({ classes, milestones, isChosen, onChoose }) {
    return <Grid container item>
        {milestones.map(milestone => (
            <ButtonBase onClick={() => onChoose(milestone)}>
                <Grid item style={{ opacity: isChosen(milestone) ? 1 : 0.6 }}>
                    <Chip label={milestone.name} className={classes.chipMilestone} />
                </Grid>
            </ButtonBase>
        ))}
    </Grid>
}

SelectMilestones.propTypes = {
    members: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SelectMilestones);

