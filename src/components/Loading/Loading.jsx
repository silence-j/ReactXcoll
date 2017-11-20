import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd'
import './style.less';

// 接受一个参数top，指定loading的上边距，单位是rem

class Loading extends React.Component {
  constructor (props) {
    super(props)
  }
  render() {
    return (
      <div className="loading-mask" style={{paddingTop: `${this.props.top}rem`}}>
        <i className="iconfont Rotate">&#xe65c;</i>
      </div>
    );
  }
}

Loading.propTypes = {
};

export default connect()(Loading);
