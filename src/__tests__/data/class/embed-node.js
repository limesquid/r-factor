import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Embed from './Embed';
import EmbedInput from './EmbedInput';

class EmbedNode extends Component {
    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        const { /*children,*/ ...props } = this.props;

        return (
            <Fragment>
                <EmbedInput
                    {...props}
                    onSubmit={() => console.log('onSubmit')}
                />
            </Fragment>
        );
    }
}

export default EmbedNode;
