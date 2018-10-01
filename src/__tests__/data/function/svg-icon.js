import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function SvgIcon({ className, height, icon, width, fill }) {
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

SvgIcon.propTypes = {
    className: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.object.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fill: PropTypes.string,
};

SvgIcon.defaultProps = {
    height: 24,
    width: 24,
    className: '',
    fill: 'currentcolor',
};
