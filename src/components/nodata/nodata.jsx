import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd'
import './nodata.less';

// 接受一个参数top，指定loading的上边距，单位是rem

class NoData extends React.Component {
  constructor (props) {
    super(props)
  }
  render() {
    const img = this.props.source
    return (
      img === 'course' ? (
        <div className="nodata">
          <img className="img-course" src={require('../../assets/nodata/nodata.png')} alt=""/>
          <p className="course-p">你还没预约过精品团课，马上选择自己喜欢的课程吧</p>
          <Button>精品团课</Button>
        </div>
      ) : (
        <div className="nodata">
          <img className="img-course" src={require('../../assets/nodata/nodata.png')} alt=""/>
          <p className="course-p">你还没报名活动，马上选择自己感兴趣的活动吧</p>
          <Button>活动报名</Button>
        </div>
      )

    );
  }
}

NoData.propTypes = {
};

export default connect()(NoData);
