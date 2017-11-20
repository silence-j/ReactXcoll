import React from 'react';
import { connect } from 'dva';

class Alert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    
    }
  }

  render() {
    <div className="message">
      <p>亲确认取消此次预约么?</p>
      <ul className="message-list">
        <li className="message-item">取消机会仅3次/年</li>
        <li className="message-item">费用将在24小时内退回至储值卡中</li>
      </ul>
    </div>
  }
}

export default connect()(Alert);
