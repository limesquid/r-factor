import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withAuth } from 'auth';
import { connect } from 'react-redux';

const hoc = ({ name }) => {
  const Button = ({ surname }) => (
    <div>
      {name}
      {surname}
    </div>
  );

  Button.propTypes = {
    surname: PropTypes.string
  };

  const mapStateToProps = (state) => ({});

  const mapDispatchToProps = {};

  return withAuth(withRouter(Button));
};

export default hoc;
