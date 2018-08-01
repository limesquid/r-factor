import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import pluralize from 'app/lib/pluralize';

const MyContext = createContext({});

export const withMyContext = Component => {
  const InnerComponent = (props) => (
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

  const mapStateToProps = (state) => ({
    
  });

  const mapDispatchToProps = {
    
  };

  return connect(mapStateToProps, mapDispatchToProps)(InnerComponent);
};

export default MyContext;
