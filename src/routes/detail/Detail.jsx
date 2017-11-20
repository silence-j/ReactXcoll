import React from 'react';
import { connect } from 'dva';
import { Route, Link } from 'dva/router';
import Course from '../course/Course'
import teacherinfo from "../../services/teacherAPI.js"
import Lunbo from '../courseDetail/carousel/carsouel.jsx'
import qs from "query-string"
import './style.less';
import defaultimg from "../../assets/posipic.png"
import { Rate ,Icon} from 'antd';
import {dateFormat, TimeSec, allTurnTime } from '../../utils/dateFormat'
import Loading from '../../components/Loading/Loading'
import { Toast, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import Lunbopic from '../social/show/hot/enlarger/enlarger.jsx'

class IndexPage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			teacherdescription:'',
			islunbo:false,
			isLoading:true,
			issayLoading:true,
			score:0,
			description:"",
			todaymonth:0,
			todayday:0,
			todayzhou:0,
			tomorrowmonth:0,
			tomorrowday:0,
			tomorrowzhou:0,
			aftermonth:0,
			afterday:0,
			afterzhou:0,
			buyStatus: 888,
			teacher: {},

			normalList: [],
			featureList: [],
			today: [],
			tomorrow: [],
			afterTomorrow: [], 
			lunbolist:[],
			saysome:[],
			timepack: [
			  "08:00-09:00",
				"08:30-09:30",
				"09:00-10:00",
				"09:30-10:30",
				"10:00-11:00",
				"10:30-11:30",
				"11:00-12:00",
				"11:30-12:30",
				"12:00-13:00",
				"12:30-13:30",
				"13:00-14:00",
				"13:30-14:30",
				"14:00-15:00",
				"14:30-15:30",
				"15:00-16:00",
				"15:30-16:30",
				"16:00-17:00",
				"16:30-17:30",
				"17:00-18:00",
				"17:30-18:30",
				"18:00-19:00",
				"18:30-19:30",
				"19:00-20:00",
				"19:30-20:30",
				"20:00-21:00",
				"20:30-21:30",
				"21:00-22:00",
			],
			disable:"",
			str: '日一二三四五六'
		}

	}

	componentDidMount() {
	    
		
		document.title="私教详情"

		let a = (qs.parse(this.props.location.search)).id
		localStorage.teacherflag = a
		
		teacherinfo.getCoachDetail({
				id: a
			}).then(res => {
				console.log(res)
				this.setState({
					teacher: res.data.data,
					buyStatus: res.data.data.buyStatus,
					lunbolist:res.data.data.banner.length>0? res.data.data.banner : [defaultimg],
					description:res.data.data.description,
					score:res.data.data.score,
					teacherdescription:res.data.data.description
				})
				
			}),

			teacherinfo.gettime({
				coachId: a
			}).then(res => {
				
				console.log(res)
				this.setState({
					today: res.data.data.today,
					tomorrow: res.data.data.tomorrow,
					afterTomorrow: res.data.data.afterTomorrow
					
				})
				
		if(this.state.today.length==0&&this.state.tomorrow.length==0&&this.state.afterTomorrow==0){
				
				this.refs.zhezhao.style.display="block"
				this.refs.yubtn.style.backgroundColor="gray"
				
			}
				
			}),

			teacherinfo.getlesson({
				coachId: a
			}).then(res => {
				
				console.log(res)
				this.setState({
					featureList: res.data.data.featureList,
					normalList: res.data.data.normalList,
					isLoading:false
				})
			}),
			
			teacherinfo.pingjia({type:1,id:a}).then(res =>{
				console.log(res)
				this.setState({
					saysome:res.data.data.records,
					issayLoading:false
				})
			})
			
			//计算预约时间和转换
			
			 var jintian=this.state.str[new Date(dateFormat(new Date())).getDay()]
	   		 var mingtian=this.state.str[new Date(dateFormat(new Date(), 1)).getDay()]
		     var houtian=this.state.str[new Date(dateFormat(new Date(), 2)).getDay()]			
			var todayzu=this.GetDateStr(0).split("-")
            var tomorrowzu=this.GetDateStr(1).split("-")			
			var afterzu=this.GetDateStr(2).split("-")
			this.setState({
				todaymonth:todayzu[1],
				todayday:todayzu[2],
				todayzhou:jintian,
				tomorrowmonth:tomorrowzu[1],
				tomorrowday:tomorrowzu[2],
				tomorrowzhou:mingtian,
				aftermonth:afterzu[1],
				afterday:afterzu[2],
				afterzhou:houtian
				
			})
		
	}

	select() {
		var valuebox = []

		var myselect1 = this.refs.select1
		var myvalue1 = myselect1.options[myselect1.selectedIndex].value
			
		
		if(myvalue1 != "请选择时间") {
			if(this.state.today.length>0&&this.state.today[myvalue1].timeId){
				let myTimeId1 = this.state.today[myvalue1].timeId
				valuebox.push(myTimeId1)
			}
			

		}		
		var myselect2 = this.refs.select2
		var myvalue2 = myselect2.options[myselect2.selectedIndex].value

		console.log(myvalue2)
		if(myvalue2 != "请选择时间") {
			if(this.state.tomorrow.length>0&&this.state.tomorrow[myvalue2].timeId){
				let myTimeId2 = this.state.tomorrow[myvalue2].timeId
				valuebox.push(myTimeId2)
			}
			
		}

		var myselect3 = this.refs.select3
		var myvalue3 = myselect3.options[myselect3.selectedIndex].value
        
        console.log(this.state.afterTomorrow)
        console.log(myvalue3)
		if(myvalue3 != "请选择时间") {
			if(this.state.afterTomorrow.length>0&&this.state.afterTomorrow[myvalue3].timeId){
				let myTimeId3 = this.state.afterTomorrow[myvalue3].timeId
				valuebox.push(myTimeId3)
				console.log(valuebox)
			}
			
		}

		let valuestring = valuebox.join(",")		
		teacherinfo.isvip().then(res => {
			
			if(res.data.data.userType == 1) {
				if(this.state.buyStatus == 0) {
					localStorage.setItem('coachId',qs.parse(this.props.location.search).id)
					this.props.history.push('/vipdetail')
				} else {
					if(valuestring == "") {
						Toast.success('请选择预约时间段',2)
					} else {
						console.log(valuestring)
						teacherinfo.yuyue({
							scheduleIds: valuestring
						}).then(res => {
							console.log(res)
							res.data.data[0]
							
						   Toast.success('预约成功', 2, ()=>{
								this.props.history.push({
			                      pathname: '/ysuccess',
			                      search: `?scheduleIds=${valuestring}&reservid=${res.data.data[0]}&kindof=personnal`
		                    })},true);
						
						})

					}

				}

			} else {
			
				Toast.info('亲，您还不是会员，请先购买会员卡',2,()=>{this.props.history.push({pathname: '/index/clubCard'})},true)}
					
			})                      
			                      
		}                    
	
	yuyuetime (){
		this.refs.yuyuetime.style.display="none"
	}
	yuvip (){
		this.refs.yuvip.style.display="none"
		this.props.history.push('/index/clubCard')
	}
	
	
	
	

	vipbuy() {
		localStorage.setItem('coachId',qs.parse(this.props.location.search).id)
		this.props.history.push('/vipdetail')
	}
	
	GetDateStr (AddDayCount) {
				var dd = new Date();
				dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
				var y = dd.getFullYear();
				var m = dd.getMonth() + 1; //获取当前月份的日期 
				var d = dd.getDate();
				return y + "-" + m + "-" + d;
	}
	 
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
	featureclick (lessonid){
		console.log(999)
		this.props.history.push(`/lessondetail?whatid=${lessonid}&teacherid=${(qs.parse(this.props.location.search)).id}`)
	}
	normalclick (lessonid){
		this.props.history.push(`/lessondetail?whatid=${lessonid}&teacherid=${(qs.parse(this.props.location.search)).id}`)
	}
	
	changelunbo (){
		this.setState({
			islunbo:true
		})
	}
	beLarger(){
		this.setState({
			islunbo:false
		})
	}

	render() {
		
		console.log(typeof(this.state.score))

		return(

			<div className="stylebox">
				<div className="lunbo-box"> 
						  <Lunbo banner={this.state.lunbolist}></Lunbo>
				</div>

				<div className="people-info">
				
					<div className="info-box">
						<div className="left">
							<div className="header-pic" onClick={this.changelunbo.bind(this)} style={{backgroundImage: `url(${this.state.teacher.photo? `${this.state.teacher.photo}?x-oss-process=image/resize,h_120` : require('../../assets/posipic.png?x-oss-process=image/resize,h_120')})`}}></div>
							<p className="name">{this.state.teacher.name}</p>
						</div>
						
						<div className="right">
							<div className="line1">
							
								<Rate className="iconfont top-rate" disabled    value={this.state.score} character={<Icon type="heart" />}   allowHalf />
								<span>·累计上课{this.state.teacher.serviceCount}节</span>
							</div>
							<p className="line2">擅长:{this.state.teacher.goodAt}</p>
							<p className="good-at">
					            <span className={this.state.showMore ? 'allField' : 'field'}>资质:
					              <span>{this.state.teacherdescription}</span>
					            </span>
					          </p>
						</div>
						
					</div>	
					{this.state.teacherdescription.length>32?
					 (<div className="jiantou">	
						{this.state.showMore ? <i type="up" className="iconfont" onClick={this.showMore.bind(this, 'up')}>&#xe652;</i> : <i type="down" className="iconfont" onClick={this.showMore.bind(this, 'down')}>&#xe643;</i>}
					</div>) : ('')
					}
						
				</div>	
				
				<div className="content1-box">
					<div>
						<h3>可预约时间段</h3>
						
						<ul>
						<li>
							<div className="time-left">
								<span>今天</span>
								<div></div>
								<span>{this.state.todaymonth}.{this.state.todayday<10? "0" : ''}{this.state.todayday}(周{this.state.todayzhou})</span>
							</div>
									
									<select  disabled={this.state.today.length==0 ? "disabled" : ""} className="select" ref="select1">
									<option ref="a">{this.state.today.length==0 ? "已约满" : "请选择时间"}</option>
									{   
											this.state.today.map((item,index) =>{
											
											return (
													<option value={index} key={index}>{this.state.timepack[item.timeFlag-1]}</option>		
												)
										})
									}
								</select>
						</li>
						
						<li>
							<div className="time-left">
								<span>明天</span>
								<div></div>
								<span>{this.state.tomorrowmonth}.{this.state.tomorrowday<10? "0" : ''}{this.state.tomorrowday}(周{this.state.tomorrowzhou})</span>
							</div>
								
								<select  disabled={this.state.tomorrow.length==0 ? "disabled" : ""} className="select" ref="select2">
									<option className="fontoption">{this.state.tomorrow.length==0 ? "已约满" : "请选择时间"}</option>
									{   
										
											this.state.tomorrow.map((item,index) =>{
											
											return (
													<option value={index} key={index}>{this.state.timepack[item.timeFlag-1]}</option>		
												)
										})
									}
								</select>
						</li>
						
						<li>
							<div className="time-left">
								<span>后天</span>
								<div></div>
								<span>{this.state.aftermonth}.{this.state.afterday<10? "0" : ''}{this.state.afterday}(周{this.state.afterzhou})</span>
							</div>
						
								<select  disabled={this.state.afterTomorrow.length==0 ? "disabled" : ""} className="select" ref="select3">
									<option>{this.state.afterTomorrow.length==0 ? "已约满" : "请选择时间"}</option>
									{   
										
											this.state.afterTomorrow.map((item,index) =>{
											
											return (
													<option value={index}>{this.state.timepack[item.timeFlag-1]}</option>		
												)
										})
									}
								</select>
						</li>
					
						</ul>
						<h3>所授课程</h3>
						<p className="zhushi">(注:同类课程支持混搭,请线下与私教协商排课)</p>
						
						{
							this.state.isLoading ? 
							(
								<Loading top="1"></Loading>
							) : (
									
									<div>
									<h3 className="best-lesson">精品课程</h3>
									<ul className="what-best">
										
										 {
								            this.state.featureList.map((item,index) => {
								            	
								              return (
								                <li key={index} onClick={this.featureclick.bind(this,item.id)}>
													<div style={{backgroundImage: `url(${item.photo? `${item.photo}?x-oss-process=image/resize,h_60` : require('../../assets/posipic.png?x-oss-process=image/resize,h_120')})`}}></div>
													<div>
														<h3>{item.name}</h3>
														<Rate className="pingstart" disabled defaultValue={item.score}></Rate>
														<div className="biaoqian">
														
														{ 
															item.tag!=""&&item.tag!=null?
															item.tag.split("|").map((mine, index) =>{

															return (<span key={index}>{mine}</span>)
															}) : ""

														}
															
														</div>
													</div>
												</li>
								              )
								            })
								          }
									
									</ul>
									
									<h3 className="best-lesson">常规课程</h3>
									
									
										<ul className="what-best">
											
										 {
								            this.state.normalList.map((item,index) => {
								              return (
																<li key={item.id} onClick={this.normalclick.bind(this,item.id)}>
																    
																	<div style={{backgroundImage: `url(${item.photo? `${item.photo}?x-oss-process=image/resize,h_120` : require('../../assets/posipic.png?x-oss-process=image/resize,h_120')})`}}></div>
																		<div>
																			<h3>{item.name}</h3>
																			<Rate className="pingstart" disabled defaultValue={item.score}></Rate>
																		<div className="biaoqian">
																		{ 
																			item.tag!=""&&item.tag!=null?
																			item.tag.split("|").map((mine, index) =>{

																			return (<span key={index}>{mine}</span>)
																			}) : ""

																		}
																		</div>
																	</div>
																</li>
								              )
								            })
								          }
										
									    </ul>
									    </div>
										)
						}
					
						{this.state.saysome.length===0?
						"" :
						(<div className="liuyan">						   
							<i className="iconfont">&#xe62f;</i>
							<h3>留言板</h3>
						</div>)
						}
						
						
					</div>
					
				</div>	
				{
					this.state.issayLoading ? 
					(
						<Loading top="1"></Loading>
					) : (
						<ul className="what-say">
						{
							this.state.saysome.map((item, index) =>{
								return (
									  <li key={index}>
										<div className="header-pic" style={{backgroundImage: `url(${item.avatar? `${item.avatar}?x-oss-process=image/resize,h_120` : require('../../assets/posipic.png?x-oss-process=image/resize,h_120')})`}}></div>
										<div className="say-content">
											<p>
												<span>{item.nickName}</span>
												<span>{allTurnTime(item.createTime)}</span>
											</p>
											
											<Rate className="pingstart" disabled defaultValue={item.score}></Rate>
											<p className="person-say">{item.content}</p>
											
										</div>
										
									  </li>
							)
						})
						}
					
					</ul>
					)
				}
				
				<a ref="yubtn" className="sub-some" onClick={this.select.bind(this)}>
					
				<span>预约</span>
				</a>
				<div ref="alerbox" className="alert-box" onClick={this.vipbuy.bind(this)}>请先购买会员</div>
				<div onClick={this.yuyuetime.bind(this)} ref="yuyuetime" className="yuyuetime">
					<h3>提示</h3>
					<p>亲,请点击选择预约时间段</p>
					<h3>知道了</h3>
				</div>
				
				<div ref="yuvip" onClick={this.yuvip.bind(this)}  className="yuyuetime">
					<h3>提示</h3>
					<p>亲,非会员无法加入我们的课程,<br/>快来加入我们吧!</p>
					<h3>知道了</h3>
				</div>
				
				<div ref="yucheng"  className="yuyuetime yucheng">
					
					<p>亲,您已经预约成功</p>
					
				</div>
				
				<div ref="zhezhao" className="zhezhao"></div>
				{this.state.islunbo ? (<Lunbopic dot='false' image={this.state.teacher.photo==null||this.state.teacher.photo==''? ([require('../../assets/posipic.png?x-oss-process=image/resize,h_60')]) : ([this.state.teacher.photo])} largerTo={this.beLarger.bind(this)}></Lunbopic>): ''}
			</div>
		)
	}

}

IndexPage.propTypes = {};

export default connect()(IndexPage);