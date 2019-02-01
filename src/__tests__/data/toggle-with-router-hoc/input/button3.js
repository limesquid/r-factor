import React from 'react';
import { withRouter } from 'react-router-dom';

const ButtonComponent = (props) => (
  <>
    <div>Button</div>
  </>
);

export const Button = withRouter(ButtonComponent);
