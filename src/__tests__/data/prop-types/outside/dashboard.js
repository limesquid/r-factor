import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectTimeseries,
  selectTrendChangePercentage
} from 'store/currency-pairs/selectors';
import styles from './styles.scss';

class Dashboard extends Component {
  render() {
    const { timeseries, trendChangePercentage } = this.props;

    return (
      <div className={styles.dashboard}>

      </div>
    );
  }
}

Dashboard.propTypes = {
  timeseries: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    timestamp: PropTypes.number
  })),
  trendChangePercentage: PropTypes.number
};

const mapStateToProps = (state) => ({
  timeseries: selectTimeseries(state),
  trendChangePercentage: selectTrendChangePercentage(state)
});

export default connect(mapStateToProps)(Dashboard);
