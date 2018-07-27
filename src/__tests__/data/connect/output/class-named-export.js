import { connect } from 'react-redux';

class ButtonComponent extends Component {
  render() {
    const props = this.props;

    return (
      <div>Button</div>
    );
  }
}

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = {};

export const Button = connect(mapStateToProps, mapDispatchToProps)(ButtonComponent);
