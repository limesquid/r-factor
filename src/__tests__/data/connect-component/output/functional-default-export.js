import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from './styles.scss';

const Button = ({ className, children, ...props }) => (
  <div className={classNames(styles.button, className)} {...props}>
    {children}
  </div>
);

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
