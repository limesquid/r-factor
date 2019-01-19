import React from 'react';
import { withRouter } from 'react-router-dom';

const ButtonComponent = () => (<span>Text</span>);

export const Button = withAuth(ButtonComponent);
