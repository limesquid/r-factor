import React from 'react';
import { withAuth } from 'auth';
import { withRouter } from 'react-router-dom';

const ButtonComponent = (props) => (
  <>
    <div>Button</div>
  </>
);

export const Button = withRouter(withAuth(ButtonComponent));
