import { BaseButtonPropTypes } from 'common-prop-types';
import PropTypes from 'prop-types';

const Button = (props) => {
  const { onClick } = props;

  return (
    <div onClick={onClick}>
      {props.children}
    </div>
  );
}

Button.propTypes = {
  ...BaseButtonPropTypes,
  children: PropTypes.node,
  onClick: PropTypes.func
};
