import React from 'react';
import { connect } from 'dva';
import { Rate, Icon } from 'antd';
import { Link } from 'dva/router';
import qs from 'query-string'
import personalAPI from '../../services/personalAPI.js';
import './style.less';
import Loading from "../../components/Loading/Loading"
import authInit from '../../utils/auth.js'

class Personal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    	isLoading:true,
      tit: '人气教练',
      coachList: [],
      appointList: [],
      default1Style: 'block',
    }
  }
  componentDidMount() {
  	document.title="私教课"
    authInit(window).then( res => {
      // 请求私教页面头部数据
      personalAPI.getCoachList ({ page:1 }).then(res => {
      	
        let arr = []
        let myArr = []
        let data = res.data.data.records
        console.log(res)
        for ( let index in data) {
          // 将排名前3的放置头部 后面的依次往下排
          if (index < 3) {
            arr.push({
               id: data[index].id, 
               name: data[index].name, 
               dsc: data[index].goodAt, 
               photo: data[index].photo, 
               score: data[index].score, 
               total: data[index].serviceCount, 
               oder: data[index].reserve 
              })
          } else {
            myArr.push({
               id: data[index].id, 
               name: data[index].name, 
               dsc: data[index].goodAt,
               photo: data[index].photo, 
               score: data[index].score, 
               total: data[index].serviceCount,
               oder: data[index].reserve
               })
          }
        }
        this.setState({
          coachList: arr,
          appointList: myArr,
          isLoading:false
        })
      })
    })
  }

  render() {
    return (
    	<div>
    	{
    		this.state.isLoading ? 
    		(
    			<Loading top='15'></Loading>
    		) : (
    			<div className="personal-course">
        <div className="tit">
          <i className="iconfont hot-icont">&#xe65d;</i>  
          <h3>{this.state.tit}</h3>
        </div>
        <div className="coach">
          <ul className="coach-list"> {
            this.state.coachList.map((item,index) => {
              return (
              	<Link to={`/teacher/?id=${item.id}`} key={index}>
                <li className="coach-item">     
                  <img src={item.photo ? `${item.photo}?x-oss-process=image/resize,h_200` : require('../../assets/defaultCarsouel.png?x-oss-process=image/resize,h_200')} className="love-heart" alt=""  />               
                <div className="coach-dsc">
                  <p className="coach-res">{item.name}</p>
                  <Rate className="iconfont top-rate" disabled  defaultValue={item.score} character={<Icon type="heart" />} allowHalf />
                  <p className="speciality">{item.dsc}</p>
                </div>
                <img src={require('../../assets/image/hot.png')} className="support" alt="" />
              </li>
              </Link>)
            })
          }
          </ul>
        </div>
        <div className="isAppoint">
          <ul className="infoList"> {
          		this.state.appointList.map((item,index) => {
              return (
              	<Link to={`/teacher/?id=${item.id}`} key={index} >
                <li className="info-show" key={item.name}>                  
                    <div className="avantor" style={{backgroundImage:`url(${item.photo ? `${item.photo}?x-oss-process=image/resize,h_200` : require('../../assets/defaultCarsouel.png?x-oss-process=image/resize,h_200')})`}} />                  
                  <div className="info-detail">
                    <span className="coach-name">{item.name}
                     {this.state.appointList[index].oder===0? "" : (<span className="graph"><div className='sanjiao'></div><em className="rectangle">今日可约</em></span>)}
                    </span>
                    <span className="total-couse"><Rate className="iconfont"  disabled  defaultValue={item.score} character={<Icon type="heart" />} allowHalf />/累计上课{item.total}节</span>
                    <span className="strong-point">{item.dsc}</span>
                  </div>
                  <img className="xcool" src={require('../../assets/image/xcool.png')} alt="" />
                </li>
                </Link>
              )
            })
          	
            
          }
          </ul>
        </div>
      </div>
    		)
    	}
      </div>
    )
  }
}


export default connect()(Personal);
