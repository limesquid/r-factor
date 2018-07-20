import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';

const CONST = '#'; // TODO: something

function ImageHeader({ contracted, imageUrl, onAddClick, onEditClick, onRemoveClick }) {
    return (
        <div
            className={classNames('cipka__header', {
                'cipka__header--imageless': !imageUrl,
                'cipka__header--contracted': contracted
            })}
            style={{
                backgroundImage: imageUrl ? `url("${imageUrl}")` : 'none',
            }}
        >
            {!imageUrl && (
                <Fragment>
                    <Button
                        className="cipka__header-add-button"
                        onClick={onAddClick}
                    >
                        Add Header Image
                    </Button>

                    <a href={CONST} target="_blank">
                        Help with Header Images
                    </a>
                </Fragment>
            )}
            {imageUrl && (
                <div className="cipka__header-buttons">
                    <Button bsSize="xs" onClick={onEditClick}>
                        <i className="icon icon-pencil" />
                    </Button>
                    <Button bsSize="xs" bsStyle="danger" onClick={onRemoveClick}>
                        <i className="icon icon-trash" />
                    </Button>
                </div>
            )}
        </div>
    );
}

ImageHeader.propTypes = {
    contracted: PropTypes.bool,
    imageUrl: PropTypes.string,
    onAddClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired
};

ImageHeader.defaultProps = {
    contracted: false,
    imageUrl: ''
};

export default ImageHeader;
