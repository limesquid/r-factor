import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class SvgIcon extends Component {
    static propTypes = {
        className: PropTypes.string,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        icon: PropTypes.object.isRequired,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        fill: PropTypes.string,
    };

    static defaultProps = {
        height: 24,
        width: 24,
        className: '',
        fill: 'currentcolor',
    };

    render() {
        const { className, height, icon, width, fill } = this.props;

        return (
            <svg
                className={classNames('svg-icon', className)}
                height={height}
                width={width}
                fill={fill}
            >
                <use xlinkHref={`#${icon.id}`} />
            </svg>
        );
    }
}

export default SvgIcon;
