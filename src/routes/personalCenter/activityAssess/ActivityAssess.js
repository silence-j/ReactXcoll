import React from 'react';
import { connect } from 'dva';
import { Rate, Button } from 'antd';
import './style.less';

class ActivityAssess extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      evaluate: '还阔以',
    }
  }

  render() {
    return (
      <div className="container">
        <h2 className="grade">总体评分:</h2>
        <Rate className="start" allowHalf defaultValue={2.5} />
        <textarea className="txtarea" id="txtarea" placeholder="请输入你想说的" />
        <i className="iconfont camera">&#xe627;</i>
        <Button className="btn" type="primary">提交评论</Button>
      </div>
    )
  }
}


export default connect()(ActivityAssess);
