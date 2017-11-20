import React from 'react';
import { connect } from 'dva'
import { NavLink } from 'dva/router'
import dateFormat from '../../../utils/dateFormat.js'
import './league.less';

class League extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      weekStr : '日一二三四五六'
    }
  }
  render() {
    let data = this.props.courseList
    let weekStr = '日一二三四五六'
    let courseTime = `${dateFormat.dateFormat(+data.startTime).substr('5')}(周${weekStr[new Date(+data.startTime).getDay()]}) ${dateFormat.TimeSec(+data.startTime)} ~ ${dateFormat.TimeSec(+data.endTime)}`
    let state
    if (data.orderNum < data.planNum) {
      state = '可预约'
    } else if (data.orderNum >= data.planNum) {
      state = '排队中'
    }
    return (
      <div className="league-course">
        <p className="league-name">精品团课</p>
        <div>{data.startTime}</div>
        {
          data !== null && <data className="length"></data> !== 0 && data !== '' && (
            data.map((item, index) => {
              return (
                <NavLink exact to={{pathname: '/courseDetail', search: `?id=${item.id}`}} key={index}>
                  <div className="league-bg"  style={{backgroundImage: `url(${item.photo || require('../../../../public/sport.jpg')})`}}>
                    <span className="order"><em className="em">{item.orderNum < item.planNum ? '可预约' : <em className='em'>{item.orderNum >= item.planNum ? '排队中' : ''}</em> }</em></span>
                    <div className="info">
                      <p className="carnival">{item.courseName}-{item.coachName}</p>
                      <p className="time-address">{`${dateFormat.dateFormat(+item.startTime).substr('5')}(周${this.state.weekStr[new Date(+item.startTime).getDay()]}) ${dateFormat.TimeSec(+item.startTime)} ~ ${dateFormat.TimeSec(+item.endTime)}`}</p>
                    </div>
                  </div>
                </NavLink>
              )
            })
          )
        }
      </div>
    );
  }
}

League.propTypes = {
};

export default connect()(League);
