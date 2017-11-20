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
import teacherinfo from '../../services/teacherAPI'



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
      lastcount:0,
      timer: null,
      qrcodeTipShow: false,
      personnal:{}
		}
  }
  componentWillUnmount () {
    if (this.state.timer ) {
      window.clearInterval(this.state.timer)
    }
  }
  componentDidMount () {
    let documentTitle = qs.parse(this.props.location.search).state == 2 ? '排队中' : '预约成功'
    document.title = documentTitle

  //  判断获取精品团课还是活动数据
    if (qs.parse(this.props.location.search).kindof === 'course') {
      let param = {scheduleId: qs.parse(this.props.location.search).scheduleId}
      this.getDetail(param)
      this.getQrcode(param)
       // 30秒刷新一次
      let localTimer = window.setInterval( () => {
        this.getQrcode(param)
      }, 30000)
      this.setState({
        timer: localTimer
      })
    }
    if (qs.parse(this.props.location.search).kindof === 'active') {
      let param = {activityId: qs.parse(this.props.location.search).activityId}
      this.getActiveDetail(param)
    }
    
    
    
    if (qs.parse(this.props.location.search).kindof === 'personnal') {
    	let param={reserveId: qs.parse(this.props.location.search).reservid}
      let qrCodeParam = {scheduleId: qs.parse(this.props.location.search).scheduleIds}
      this.getnews(param)
      this.getQrcode(qrCodeParam)
        // 30秒刷新一次
      let localTimer = window.setInterval( () => {
        this.getQrcode(qrCodeParam)
      }, 30000)
      this.setState({
        timer: localTimer
      })
    }
    
  }

  getQrcode(param) {
    personalAPI.getCoachDoorQRCode(param).then( res => {
      if ((res.data.message === '开门时间未到') || (qs.parse(this.props.location.search).state == 2)) {
        this.setState({
          qrcodeTipShow: true
        })
        window.clearInterval(this.state.timer)
      } else {
        document.getElementById("qrcode").innerHTML = ''
        // 生成一个二维码
        new QRCode(document.getElementById("qrcode"), {
          text: res.data.data,
          width: 180,
          height: 180,
        });
      }
    })

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
  
  getnews (param){
  	
  	teacherinfo.erweima(param).then((res) => {
  		console.log(res)
  		this.setState({
  			personnal:res.data.data
  		})
  	})
  }
  
  render() {
    const whichType = qs.parse(this.props.location.search).kindof
    
    let whattitle
    if(whichType==='course'){
    	whattitle="精品团课"
    }else if(whichType==='personnal'){
    	whattitle="私教课程"
    }else{
    	whattitle="活动"
    }
    
    let whatname
    
    if(whichType==='course'){
    	whatname=this.state.info.name
    }else if(whichType==='personnal'){
    	if(this.state.personnal.type==7){
    		whatname="精品课程"
    	}else{
    		whatname="常规课程"
    	}	
    }else{
    	whatname = this.state.activeInfo.title
    }
    
    let timeday
    let timezhou
    let timestart
    let timeend
    if(whichType==='course'){
    	timeday=dateFormat(this.state.info.startTime).substr(5).replace('-', '.')
    	timezhou=this.state.str[new Date(dateFormat(this.state.info.startTime)).getDay()]
    	timestart=TimeSec(this.state.info.startTime)
    	timeend=TimeSec(this.state.info.endTime)
    }else if(whichType==='personnal'){
    	timeday=dateFormat(this.state.personnal.startTime).substr(5).replace('-', '.')
    	timezhou=this.state.str[new Date(dateFormat(this.state.personnal.startTime)).getDay()]
    	timestart=TimeSec(this.state.personnal.startTime)
    	timeend=TimeSec(this.state.personnal.endTime)
    }else{
    	timeday=dateFormat(this.state.activeInfo.startTime).substr(5).replace('-', '.')
    	timezhou=this.state.str[new Date(dateFormat(this.state.activeInfo.startTime)).getDay()]
    	timestart=TimeSec(this.state.activeInfo.startTime)
    	timeend=TimeSec(this.state.activeInfo.endTime)
    }
    
    let address
    
    if(whichType==='course'){
    	address=this.state.info.address
    }else if(whichType==='personnal'){
    	address=this.state.personnal.address
    }else{
    	address=this.state.activeInfo.address
    }
    
    let howmany
    
    if(whichType==='course'){
    	howmany=this.state.info.orderNum
    }else if(whichType==='personnal'){
    	howmany=1
    }else{
    	howmany=this.state.activeInfo.signPersonNum
    }
    
    
    
    return (
      <div className="home-view">
        {
          whichType !== 'active' ?
          <div className="box-top note-tip">
              <span>入场二维码</span>
              <div className={this.state.qrcodeTipShow ? 'qrcode-container grey-bg' : 'qrcode-container'}>
                <div id="qrcode">
                  {
                    this.state.qrcodeTipShow ? <span className="halfhour">{qs.parse(this.props.location.search).state ==2 ? '若排队成功, 开课前半小时将生成二维码' : '开课前半小时生成'}</span> : ''
                  }
                </div>
              </div>  
          </div>
          : ''
        }
        
        <div className="box-under">
        		<h3>{whattitle}:<span>{whatname}</span></h3>
        		<h3>时间:<span>
							{
                  <span>
										{timeday}(周{timezhou})/{timestart}~{timeend}
									</span>
							}
						</span></h3>
        		<h3>地点:<span>{address}</span></h3>
        		<h3>预约人数:<span>{howmany}人</span></h3>
        		{this.state.personnal.count? <h3>剩余节数:<span>{this.state.personnal.count}</span></h3> : ""}
        		
        		<ul className="border-center">
		    			<li></li>
		    			<li></li>
		    			<li></li>
       			</ul>
       			

       			{
       				whichType !== 'course'?
		       			(<div className="some-notice">
		       				<p>
					       			<i className='iconfont zhuyi'>&#xe63b;</i>
					       			<span>注意事项</span>
		        			</p>
		        			<p>1.{whichType !== 'active' ? '预约课程请在购买与预约-我的预约-私教中查看' : '活动报名后请在个人中心-参与活动-未开始中查看'}</p>
		        			<p>2.{whichType !== 'active' ? '开课前2小时内不可取消预约' : '活动开始前30分钟内不可取消报名'}</p>
		        			<p>3.{whichType !== 'active' ? '请按约定时间上课,若迟到,上课时间不予顺延' : '活动开始后5分钟不得入场，报名费不予退还'}</p>
		       			</div>) :
				       	(<div className="some-notice">
			       				<p>
						       			<i className='iconfont zhuyi'>&#xe63b;</i>
						       			<span>注意事项</span>
			        			</p>
			        			<p>1.预约课程请在购买与预约-我的预约-精品团课中查看</p>
			        			<p>2.开课前三十分钟不能取消预约;</p>
			        			<p>3.开课后5分钟不得入场,报名费不予退还</p>
		       			</div>)
       			}  			
        </div>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
