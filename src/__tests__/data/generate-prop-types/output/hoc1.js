import React, { createContext } from 'react';
import PropTypes from 'prop-types';

const MyContext = createContext({});

export const withMyContext = (Component) => {
    const MyComponent = ({ performMy, rejectMy, ...props }) => (
        <MyContext.Consumer>
            {(massDelete) => (
                <Component
                    {...props}
                />
            )}
        </MyContext.Consumer>
    );

    MyComponent.propTypes = {
        performMy: PropTypes.any,
        rejectMy: PropTypes.any
    };
};

export default MyContext;
