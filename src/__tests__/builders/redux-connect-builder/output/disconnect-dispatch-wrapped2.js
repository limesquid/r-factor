import React from 'react';
import { withRouter } from 'react-router';

const ButtonComponent = () => (<span>Text</span>);

export const Button = withAuth(ButtonComponent);
