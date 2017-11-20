import React from 'react';
import { connect } from 'dva';
import { Route, NavLink } from 'dva/router';
import './style.less';
import Lunbo from '../../courseDetail/carousel/carsouel.jsx'
import teacherinfo from '../../../services/teacherAPI.js'
import qs from 'query-string'
import { Rate ,Icon} from 'antd';
import {dateFormat, TimeSec, allTurnTime } from '../../../utils/dateFormat'
import Loading from '../../../components/Loading/Loading'
import enCode from '../../../utils/enCode.js'



class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state={
    	teacherdescription:'',
    	isLoading:true,
    	whatlesson:{},
    	whatteacher:{},
    	shouMore:false
    }
  }
  
  componentDidMount() {
  	let whatid=qs.parse(this.props.location.search).whatid
  	teacherinfo.lessondetail({courseId:whatid}).then(res => {
  		console.log(res)
  		this.setState({
  			whatlesson:res.data.data,
  			isLoading:false
  		})
  	})
  	teacherinfo.getCoachDetail({id:(qs.parse(this.props.location.search)).teacherid}).then(res =>{
  		console.log(res)
  		this.setState({
  			whatteacher:res.data.data,
  			teacherdescription:res.data.data.description
  		})
  	})
  	document.body.scrollTop='0px'
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
  render() {
    return (
    	 this.state.isLoading? (<Loading top="20"></Loading>) :   		
    		(<div className="lessondetail-box">
    		<Lunbo banner={this.state.whatlesson.banner}></Lunbo>
    		{/*限时狂欢*/}
    		<div className="time-limit">
                      <img className="time-img" src={require('../../../assets/image/xcool.png')} alt=""/>
                      <p className="limit">{this.state.whatlesson.name}</p>
                      {/*<p className="start">*/}
                      <Rate className="start" allowHalf disabled value={this.state.whatlesson.score} />                     
        </div>
        <div className="coach-info">
                      <div className='backpic' style={{backgroundImage: `url(${this.state.whatteacher.photo? `${this.state.whatteacher.photo}?x-oss-process=image/resize,h_120` : require('../../../assets/posipic.png?x-oss-process=image/resize,h_120')})`}}></div>
                      
                      <div className="coach-name">{this.state.whatlesson.coachName}
                        <Rate className="xinxin" character={<Icon type="heart" />} allowHalf disabled value={this.state.whatteacher.score} />
                      </div>
                      <p className="good-at">
                        擅长:
                        <span> {this.state.whatteacher.goodAt}</span>
                      </p>
                      <p className="good-at">
					            <span className={this.state.showMore ? 'allField' : 'field'}>资质:
					              <span>{this.state.teacherdescription}</span>
					            </span>
                      </p>
                      {this.state.teacherdescription.length>32?
											 (<div className="jiantou">	
												{this.state.showMore ? <i type="up" className="iconfont" onClick={this.showMore.bind(this, 'up')}>&#xe652;</i> : <i type="down" className="iconfont" onClick={this.showMore.bind(this, 'down')}>&#xe643;</i>}
											</div>) : ('')
											}
                      
        </div>
        <div className="course">
                      <p className="course-name">课程简介</p>
                      <div className="lessonname"  dangerouslySetInnerHTML={{__html:enCode(this.state.whatlesson.description)}}></div> 
                      
        </div>
        </div>
      )   
    )
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
