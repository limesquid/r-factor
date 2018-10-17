import React from 'react';
import PropTypes from 'prop-types';
import { withSomething } from 'react-nothing';
import { withNothing } from 'with-nothing';

const ButtonComponent = ({ name }) => (
  <div>
    {name}
  </div>
);

ButtonComponent.propTypes = {
  name: PropTypes.string
};

const someGetter = (store) => store.path.value;

export const Button = withSomething(someGetter, withNothing(ButtonComponent));
