import React from 'react';
import { withRouter } from 'react-router-dom';

const ButtonComponent = ({ name }) => (<span>{name}</span>);

export const Button = withAuth(ButtonComponent);
