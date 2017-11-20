import React from 'react';
import { connect } from 'dva';
import './style.less';


class PickerItem extends React.Component {
  constructor (props) {
    super(props)
  }
  render() {
    let extra = this.props.extra.split(',')
    let style = {
      fontSize: '1.42rem',
      textAlign: 'center',
      color: '#fff'
    }
    return (
      <p style={style} onClick={this.props.onClick.bind(this)}>{extra[0]}{extra[1]}{this.props.unit}</p>
    );
  }
}

PickerItem.defaultProps = {
  unit: ''
}
PickerItem.propTypes = {
};

export default connect()(PickerItem);
