import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideAlert } from 'alerts/state';
import { selectAlerts } from 'alerts/selectors';
import { Message } from 'semantic-ui-react';

const Alerts = ({ alerts, onHideAlert }) => (
  <div style={{ marginBottom: '1em' }}>
    {alerts.map(({ description, level, title }, index) => (
      <Message
        key={index}
        info={level === 'info'}
        negative={level === 'error'}
        success={level === 'success'}
        onDismiss={() => onHideAlert(index)}>
        {title && (
          <Message.Header>
            {title}
          </Message.Header>
        )}
        {description && (
          <p>
            {description}
          </p>
        )}
      </Message>
    ))}
  </div>
);

Alerts.propTypes = {
  alerts: PropTypes.array.isRequired,
  onHideAlert: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  alerts: selectAlerts(state)
});

const mapDispatchToProps = (dispatch) => ({
  onHideAlert: (index) => dispatch(hideAlert(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
