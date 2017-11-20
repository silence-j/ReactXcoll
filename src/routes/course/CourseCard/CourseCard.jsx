import React from 'react';
import { connect } from 'dva';
import { Link, NavLink } from 'dva/router'
import { Progress } from 'antd'
import dateFormat from '../../../utils/dateFormat.js'
import './style.less';


class CourseCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imgUrl: '../../../../public/sport.jpg'
    }
  }
  render() {
    let data = this.props.data
    let weekStr = '日一二三四五六'
    let courseTime = `${dateFormat.dateFormat(+data.startTime).substr('5')}(周${weekStr[new Date(+data.startTime).getDay()]}) ${dateFormat.TimeSec(+data.startTime)} ~ ${dateFormat.TimeSec(+data.endTime)}`
    let state
    if (data.status === 0) {
      state = '可预约'
    } else if (data.status === 1) {
      state = '排队中'
    } else if (data.status === 2) {
      state = '报名截止'
    }
    return (
      <NavLink exact to={{pathname: '/courseDetail', search: `?id=${data.scheduleId}`}}>
        <div className="card-wrapper" style={{backgroundImage: `url(${data.photo || require('../../../../public/sport.jpg')})`}}>
          <span className="card-state"><span>{state}</span></span>
          <div className="price">
            <p className="price-normal"><span style={{fontSize: '1rem'}}>￥</span> {(data.price / 100).toFixed(2)}</p>
            <p className="price-vip">(会员价: {(data.memberPrice / 100).toFixed(2)}元)</p>
          </div>
          <div className="card-info">
            <h1 className="card-name">{data.name}.{data.coachName}</h1>
            <p className="time-address">{courseTime}</p>
            <Progress percent={(data.orderNum / data.planNum) * 100} showInfo={false}></Progress>
            <span className="progress-number">({data.orderNum}/{data.planNum})</span>
          </div>
        </div>
      </NavLink>
    );
  }
}

CourseCard.propTypes = {
};

export default connect()(CourseCard);
