import React from 'react';
import { connect } from 'dva';
import { NavLink } from 'dva/router'
import { Icon } from 'antd'
import Carsouel from '../courseDetail/carousel/carsouel.jsx'
import DetailMsg from '../courseDetail/detailMsg/detailMsg.jsx'
import CourseProcess from '../courseDetail/courseProcess/courseProcess.jsx'
import './style.less';


class CourseDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      courseList: [
        {
          name: '活动介绍',
          content: '',
          label: [
            {val:'健身'}, {val: '运动'},{val: '我是标签'}
          ]
        },
        {
          name: '活动现场',
          content: ''
        },
      ],
      starList:[1, 2, 3, 4, 5],
      leaveMsg:[
        {
          name: 'silence1',
          time: '2017.10.19',
          message: '汗流浃背的感觉真好'
        },
        {
          name: 'silence2',
          time: '2017.10.19',
          message: '汗流浃背的感觉真好'
        },
        {
          name: 'silence3',
          time: '2017.10.19',
          message: '汗流浃背的感觉真好'
        }
      ],
      showMore: false
    }
  }
  // back () {
  //   window.history.back()
  // }
  showMore (val) {
    if (val === 'down') {
      this.setState(
        {
          showMore: true
        }
      )
    } else {
      this.setState(
        {
          showMore: false
        }
      )
    }

  }

  render() {
    return (
      <div className="D-container">
        {/*轮播图*/}
        <Carsouel></Carsouel>
        {/*限时狂欢*/}
        <div className="time-limit">
          <img className="time-img" src={require('../../assets/image/xcool.png')} alt=""/>
          <p className="start">
            {
              this.state.starList.map((item) => {
                return <Icon type="star" style={{marginRight:5+'px', color:'#F7BA2A'}} key={item}></Icon>
              })
            }
          </p>
          <p className="info time"><em className="iconfont icon-size">&#xe610;</em>201711.15(活动结束)</p>
          <p className="info address"><em className="iconfont icon-size">&#xe60f;</em>转塘店</p>
        </div>
        {/*课程流程*/}
        <ul className="course">
          {
            this.state.courseList.map((item) => {
              return <CourseProcess key={item.name} cList = {item}></CourseProcess>
            })
          }
        </ul>
        {/*留言板*/}
		<div className="msg-tit">
			<i className="iconfont">&#xe62f;</i>
			<span>留言板</span>
		</div>
        <ul className="msg-board">
          {
            this.state.leaveMsg.map((item) => {
              return <DetailMsg key={item.name}></DetailMsg>
            })
          }
        </ul>
        <NavLink exact to="/payment">
          <button className="order">预约</button>
        </NavLink>
      </div>
    )
  }
}

CourseDetail.propTypes = {
};

export default connect()(CourseDetail);
