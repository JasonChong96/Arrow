import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import Header from './Header';

function TitleOnlyHeader({ title, backPath }) {
    const titleComponent = () => <Box fontWeight={600} fontSize={34} color="black">
        {title}
    </Box>;
    return <Header
        backPath={backPath}
        contentComponent={titleComponent}
    />
}

TitleOnlyHeader.propTypes = {
    title: PropTypes.string.isRequired,
    backPath: PropTypes.string.isRequired,
}

export default TitleOnlyHeader;