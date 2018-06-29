import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';

const Navigation = ({ className, links, location }) => (
  <div className={className}>
    <Nav vertical color="primary">
      {links.map(({ label, to }) => (
        <NavItem key={to} active={to === location.pathname} className="mx-2">
          <LinkContainer to={to}>
            <NavLink>
              {label}
            </NavLink>
          </LinkContainer>
        </NavItem>
      ))}
    </Nav>
  </div>
);

Navigation.propTypes = {
  className: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(Navigation);
