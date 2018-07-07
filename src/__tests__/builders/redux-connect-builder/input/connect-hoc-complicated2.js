import React, { createContext } from 'react';
import PropTypes from 'prop-types';

import pluralize from 'app/lib/pluralize';

const MyContext = createContext({});

export const withMyContext = (Component) => (props) => (
  <MyContext.Consumer>
    {(my) => (
      <Component
        errors={my.errors}
        isError={my.isError}
        inProgress={my.isLoading}
        show={my.isConfirmation}
        {...props}
      />
    )}
  </MyContext.Consumer>
);

export default MyContext;
