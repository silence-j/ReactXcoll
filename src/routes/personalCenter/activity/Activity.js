import React from 'react';
import { connect } from 'dva';
import activityAPI from '../../../services/activityAPI.js'
import { allTurnTime } from '../../../utils/dateFormat'
import Loading from '../../../components/Loading/Loading.jsx'
import './style.less';

class Activity extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courseList: [
        { name: '已结束',value: '1' },
        { name: '未开始',value: '0' },
      ],
      info: [],
      defualValue: '1',
      isLoading: false,
    }
  }

  componentDidMount() {
    document.title = '参与活动'
    this.setState({
      isLoading: true
    })
    activityAPI.getList({recordFlag:this.state.defualValue}).then( res => {
      let data = res.data.data
      console.log(res)
      let arr = []
      for( let index in data){
        if( data[index].reserveStatus === 0) {
          data[index].operation = '已关注'
          data[index].classname = 'current'
        } else if ( data[index].reserveStatus === 1 ) {
          data[index].operation = '排队中'
          data[index].classname = 'current'
        } else if ( data[index].reserveStatus === 2 ) {
          data[index].operation = '预约成功'
          data[index].classname = 'current'
        } else if(data[index].reserveStatus === 3 ){
          data[index].operation = '已取消'
          data[index].classname = 'self-cancel'
        } else if( data[index].reserveStatus === 4 ){
          data[index].operation = '已取消'
          data[index].classname = 'opration-cancel'
        } else if(data[index].reserveStatus === 5){
          data[index].operation = '待评价'
          data[index].classname = 'current'
        } else if(data[index].reserveStatus === 6){
          data[index].operation = '已完成'
          data[index].classname = 'current'
        } 
        arr.push({
           tit: data[index].title,
          data: data[index].summary,
          photo: data[index].coverPic,
          address: data[index].address,
          date: data[index].startTime,
          operation: data[index].operation,
          id: data[index].id,
          classname: data[index].classname,
        })
      } 
      this.setState({
        info: arr,
        isLoading: false
      })
      console.log(arr)
    })
    
  }

  toggle(item) {
    if (item.value !== this.state.defualValue) {
      this.setState({
        defualValue: item.value,
      })
    }
    activityAPI.getList({recordFlag:item.value}).then( res => {
      let data = res.data.data
      console.log(data)
      let arr = []
      let classname
      for( let index in data){
        if( data[index].reserveStatus === 0) {
          data[index].operation = '已关注'
          data[index].classname = 'current'
        } else if ( data[index].reserveStatus === 1 ) {
          data[index].operation = '排队中'
          data[index].classname = 'current'
        } else if ( data[index].reserveStatus === 2 ) {
          data[index].operation = '预约成功'
          data[index].classname = 'current'
        } else if(data[index].reserveStatus === 3 ){
          data[index].operation = '已取消'
          data[index].classname = 'self-cancel'
        } else if( data[index].reserveStatus === 4 ){
          data[index].operation = '已取消'
          data[index].classname = 'opration-cancel'
        } else if(data[index].reserveStatus === 5){
          data[index].operation = '待评价'
          data[index].classname = 'current'
        } else if(data[index].reserveStatus === 6){
          data[index].operation = '已完成'
          data[index].classname = 'current'
        } 
        arr.push({
          tit: data[index].title,
          data: data[index].summary,
          photo: data[index].coverPic,
          address: data[index].address,
          date: data[index].startTime,
          operation: data[index].operation,
          id: data[index].id,
          classname: data[index].classname,
        })
      } 
      this.setState({
        info: arr
      })
    })
  }

  linkTo(item) {
    if ( item.operation !== "已取消" ) {
      this.props.history.push(`/activeDetail?id=${item.id}`)
    }
  }

  render() {
    return (
      <div className="appoint">
        <div className="tit">
          <ul className="tab-list"> {
                this.state.courseList.map((item,index) => {
                  return <li key={index} className={`tab-item ${item.value === this.state.defualValue ? 'active' : ''}`} onClick={this.toggle.bind(this, item)}>{item.name}</li>
                })
                }
          </ul>
        </div>
        {
          this.state.isLoading ?
          <Loading top={20}></Loading> :
          <div className="active-list">
            {
              this.state.info.length === 0 ?
              (
                <div className="noda">
                  <img src={require('../../../assets/nodata/nodata.png')} alt=""/>
                  <p>暂无数据</p>
                </div>
              ) : (
                <ul className="active-ul">
                  {
                    this.state.info.map((item,index) => {
                      return (<li className="active-item" key={index} onClick={this.linkTo.bind(this,item)} >
                        <img className="active-pic" src={item.coveerPic ? `${item.coverPic}?x-oss-process=image/resize,h_100` : require('../../../assets/defaultCarsouel.png')} alt="" />
                        <div className="activity-detail">
                          <p>{item.tit}</p>
                          <p className="summary">{item.data}</p>
                          <div className="icon">
                            <span className="time"><i className="iconfont">&#xe610;</i>{allTurnTime(item.date)}</span>
                            <span className="address"><i className="iconfont">&#xe60f;</i>{item.address}</span>
                          </div>
                        </div>
                        { 
                          item.operation !== '已完成' &&
                          (<div className={`active-status ${item.classname}`}>
                          <p>{item.operation}</p>
                        </div>)
                      }
                      {
                        item.operation === '已完成' &&
                        (
                          <div className="active-complite">
                            <p>{item.operation}</p>
                          </div>
                        )
                      }
                      </li>)
                    })
                  }
                </ul>
              )
            }
          </div>
        }
      </div>
    );
  }
}


export default connect()(Activity);
