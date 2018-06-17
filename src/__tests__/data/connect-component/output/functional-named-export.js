import React from 'react';
import { connect } from 'react-redux';

const PrefixButtonSuffix = (props) => (
  <div>Button</div>
);

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export const Button = connect(mapStateToProps, mapDispatchToProps)(PrefixButtonSuffix);
