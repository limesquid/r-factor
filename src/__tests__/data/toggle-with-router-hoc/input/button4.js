import React from 'react';
import { withAuth } from 'auth';

const ButtonComponent = (props) => (
  <>
    <div>Button</div>
  </>
);

export const Button = withAuth(ButtonComponent);
