import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { NavLink } from 'dva/router'
import {dateFormat, TimeSec} from '../../utils/dateFormat'
import Course from '../course/Course'
import courseAPI from '../../services/courseAPI.js'
import personalAPI from '../../services/personalAPI'
import './style.less';
import qs from 'query-string'
import QRCode from 'qrcodejs2'



class IndexPage extends React.Component {
  constructor (props) {
    super(props)
		this.state  = {
    	name: window.localStorage.courseName,
			startTime: window.localStorage.startTime,
      endTime: window.localStorage.endTime,
      address: window.localStorage.courseAddress,
      orderNum: window.localStorage.orderNum,
      str: '日一二三四五六',
      info: {},
      activeInfo: {},
      count:0,
      address:0,
      type:0,
		}
  }

  componentDidMount () {
  	var lastcount=localStorage.lastcount
  	var address=localStorage.address
  	var type=localStorage.type
  	var start=localStorage.start
  	var end=localStorage.end
  	console.log(lastcount)
  	this.setState({
  		count:lastcount,
  		address:address,
  		type:type,
  		startTime:start,
  		endTime:end
  	})
    // 生成一个二维码
    new QRCode(document.getElementById("qrcode"), {
      text: 'http://www.baidu.com',
      width: 176,
      height: 176,
    });
  //  判断获取精品团课还是活动数据
    if (qs.parse(this.props.location.search).kindof === 'course') {
      let param = {scheduleId: qs.parse(this.props.location.search).scheduleId}
      this.getDetail(param)
    }
    if (qs.parse(this.props.location.search).kindof === 'active') {
      let param = {activityId: qs.parse(this.props.location.search).activityId}
      this.getActiveDetail(param)
    }
  }
  //获取数据(精品团课)
  getDetail(param) {
    courseAPI.getCourseDetail(param).then((res) => {
      if (res.data.code === 0) {
        this.setState({
          info: res.data.data
        })
      }
    })
  }
  //获取数据（活动）
  getActiveDetail(param) {
    personalAPI.getActiveDetail(param).then((res) => {
      if (res.data.code === 0) {
        this.setState({
          activeInfo: res.data.data
        })
      }
    })
  }
  render() {
    const whichType = qs.parse(this.props.location.search).kindof
    return (
      <div className="home-view">
        <div className="box-top">
        		<span>入场二维码</span>
        		<div id="qrcode"></div>
        </div>
        <div className="box-under">
        		<h3>私教课程:<span>{this.state.type==7 ? "精品课程" : "常规课程"}</span></h3>
        		<h3>时间:<span>{dateFormat(this.state.startTime).substr(5).replace('-', '.')}(周{this.state.str[new Date(dateFormat(this.state.startTime)).getDay()]})/{TimeSec(this.state.startTime)}~{TimeSec(this.state.endTime)}	</span></h3>
        		<h3>地点:<span>{this.state.address}</span></h3>
        		<h3>预约人数:<span>1人</span></h3>
        		<h3>剩余节数:<span>{this.state.count}节</span></h3>
        		
        		
       			
       			<div className="some-notice">
       				<p>
			       			<div></div>
			       			<span>注意事项</span>
        			</p>
        			<p>1.预约课程请在购买与预约-我的预约-精品团课中查看</p>
        			<p>2.开课前三十分钟不能取消预约;</p>
        			<p>3.开课后5分钟不得入场,报名费不予退还</p>
       			</div>
       			
        </div>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
