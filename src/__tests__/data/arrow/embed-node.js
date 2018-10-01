import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Embed from './Embed';
import EmbedInput from './EmbedInput';

const EmbedNode = ({ /*children,*/ ...props }) => {
    return (
        <Fragment>
            <EmbedInput
                {...props}
                onSubmit={() => console.log('onSubmit')}
            />
        </Fragment>
    );
};

EmbedNode.propTypes = {
    children: PropTypes.node,
};

export default EmbedNode;
