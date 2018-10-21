import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { selectSortBy, selectSortOrder } from 'selectors';
import { changeSortOrder, changeSortBy } from 'store/root';
import styles from './styles.scss';
import PropTypes from 'prop-types';

const Header = ({ dataKey, label, sortBy, sortOrder, onSortOrderChange, onSortByChange, className, ...props }) => (
  <div className={classNames(styles.header, { sorted: sortBy === dataKey }, className)}>
    {label}
  </div>
);

Header.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = (state) => ({
  sortBy: selectSortBy(state),
  sortOrder: selectSortOrder(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSortOrderChange: (event, { value }) => dispatch(changeSortOrder(value)),
  onSortByChange: (event, { value }) => dispatch(changeSortBy(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
