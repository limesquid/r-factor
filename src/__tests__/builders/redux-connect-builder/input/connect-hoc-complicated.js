import React, { createContext } from 'react';
import PropTypes from 'prop-types';

const MyContext = createContext({});

export const withMyContext = (Component) => {
  const MyComponent = ({ performMy, rejectMyConfirmation, ...props }) => (
    <MyContext.Consumer>
      {(my) => (
        <Component
          show={my.isConfirmation}
          inProgress={my.isLoading}
          isError={my.isError}
          errors={my.errors}
          onConfirm={() => this.handleMyConfirmed()}
          onCancel={() => rejectMyConfirmation(my.scope)}
          {...props}
      />
    )}
    </MyContext.Consumer>
  );

  MyComponent.propTypes = {
    performMy: PropTypes.func.isRequired,
    rejectMyConfirmation: PropTypes.func.isRequired,
  };

  return MyComponent;
};

export default MyContext;
