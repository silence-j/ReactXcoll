import React from 'react';
import { connect } from 'dva';
import cancelAPI from '../../../services/cancelAPI.js'
import './Cancel.less';

class Cancel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      evaluate: '还阔以',
    }
  }

  push() {
    this.props.history.push('./index/appointment')
  }

  componentDidMount() {
    cancelAPI.cancel().then( res => {
      
    }) 
  }

  render() {
    return (
      <div className="content">
        <div className="tit">
            <p>提示</p>
            <h2 className="cancel">课程将在半小时内无法取消</h2>
        </div>
        <div className="know" onClick={this.push.bind(this)}>知道了</div>
      </div>
    )
  }
}


export default connect()(Cancel);
