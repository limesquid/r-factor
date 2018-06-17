import React from 'react';
import PropTypes from 'prop-types';

export const PrefixButtonSuffix = (props) => (
  <div>Button {prop.a}</div>
);

PrefixButtonSuffix.propTypes = {
  a: PropTypes.string
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export const Button = connect(mapStateToProps, mapDispatchToProps)(PrefixButtonSuffix);
