import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd'
import './activeDetail.less';
import { NavLink } from 'dva/router'
import Carsoual from './carousel/carsouel'
import { dateFormat, turnYMD, fenToYuan, allTurnTime } from '../../../utils/dateFormat'
import personalAPI from '../../../services/personalAPI'
import courseAPI from '../../../services/courseAPI'
import DetailMsg from './detailMsg/detailMsg'
import enCode from '../../../utils/enCode.js'
import authInit from '../../../utils/auth.js'
import { Modal } from 'antd-mobile'
import { Toast } from 'antd-mobile'

import qs from 'query-string'
import Loading from '../../../components/Loading/Loading'
import NoData from '../../../components/nodata/nodata'
import Dialog from '../../../components/dialog/dialog'

import Joiner from './joiner/joiner.jsx'


class ActiveDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: {},
      activityId: '',
      operation: [1],
      msg:[],
      dom:[{}],
      isData: false,
      isLoading: true,
      isComment: false,
      timeOver: false,
      joiner: [],
      type: '#话题#'
    }
  }
  componentDidMount () {
    document.title = '活动详情'
    authInit(window).then( res => { 
      this.getDetail()
      this.getJoiner()
    })
  }
  /**
   * 获取活动的参与者
   * @return {[type]} [description]
   */
  getJoiner () {
    courseAPI.getJoiner({activityId: qs.parse(this.props.location.search).id}).then( res => {
      this.setState({
        joiner: res.data.data
      })
    })
  }
  getDetail () {
    this.setState({
      isLoading: true,
      isData: false
    })
    personalAPI.getActiveDetail({activityId: qs.parse(this.props.location.search).id}).then(res => {
      if (!res.data.code) {
        if(res.data.data !== null && res.data.data !== undefined && res.data.data !== {}){
          let data = res.data.data
          let timeOver = (Number(res.data.data.startTime) - Date.parse(new Date()) / 1000 / 60 >= 30) ? false : true
          console.log('OPOPOP')
          console.log(timeOver)
          data.content = enCode(data.content)
          this.setState({
            isLoading: false,
            active: data,
            timeOver
          })
        } else {
          this.setState({
            isLoading: false,
            isData: true
          })
        }
      }
    })
  }
  //跳转至评价页面
  jumpTo () {
    this.props.history.push({
      pathname: '/history',
      search: `?which=active&id=${this.state.active.id}`
    })
  }
  //关注
  follow () {
    personalAPI.getFollow({activityId: this.state.active.id}).then(res => {
      if(!res.data.code){
        Toast.success('关注成功', 1, () => {
          this.getDetail()
        },true)
      } else {
        alert(res.data.message)
      }
    })
  }
  cancelOrder () {
    let params = {
      type: 2,
      id: qs.parse(this.props.location.search).id
    }
    if (this.state.timeOver) {
      return
    }
    courseAPI.cancelOrder(params).then(res => {
      if(!res.data.code) {
        authInit(window).then( res => {
          this.getDetail()
        })
      }
    })
  }
  //报名(activityType: 0:免费活动，1：收费活动)
  sign () {
    if (this.state.active.activityType === 0) {
      personalAPI.getEnroll({activityId: this.state.active.id}).then(res => {
        if(!res.data.code) {
          this.props.history.push({
            pathname: '/ysuccess',
            search: `?kindof=active&activityId=${this.state.active.id}`
          })
        }
      })
    } else if(this.state.active.activityType === 1) {
      courseAPI.getUserInfo().then(res => {
        if (!res.data.code) {
          console.log(res)
          if (res.data.data.phone !== '' && res.data.data.phone !== null && res.data.data.phone !== undefined) {
            this.props.history.push({
              pathname: '/payment',
              search: `?which=active&id=${this.state.active.id}&type=${res.data.data.userType}&virtualBalance=${res.data.data.virtualBalance}`
            })
          } else {
            this.props.history.push({
              pathname: '/login',
              search: `?which=active&id=${this.state.active.id}&type=${res.data.data.userType}&virtualBalance=${res.data.data.virtualBalance}`
            })
          }
        }
      })
    }
  }
  render() {
    return (
      <div className="active-container">
        {
          this.state.isLoading ? <Loading top="15"></Loading> : (
            <div style={{paddingBottom: 4.17+'rem'}}>
              {
                this.state.isData ? <NoData source="active"></NoData> : (
                  <div>
                    <Carsoual banner={this.state.active.banner}></Carsoual>
                    <div className="active-detail">
                      <img className="a-img" src={require('../../../assets/image/xcool.png?x-oss-process=image/resize,h_72')} alt=""/>
                      <p className="a-price">
                        <span style={{fontSize: '1rem'}}>￥</span>{fenToYuan(this.state.active.commonPrice)} <span className="member-price">(会员价: {fenToYuan(this.state.active.memberPrice)}元)</span>
                      </p>
                      <p className="a-time"><em className="iconfont icon-size">&#xe610;</em> {allTurnTime(this.state.active.startTime)}-{allTurnTime(this.state.active.endTime)}(活动)</p>
                      <p className="a-enroll">报名时间: {turnYMD(this.state.active.signStartTime)}-{turnYMD(this.state.active.signEndTime)}</p>
                      <p className="a-address"><em className="iconfont icon-size">&#xe60f;</em> {this.state.active.address}</p>
                      {
                        this.state.joiner !== null && this.state.joiner.length !== 0 ? (
                          <p className="a-address"><em className="iconfont icon-size">&#xe65b;</em>已报名： {this.state.joiner.length} 人</p>
                        ) : ''
                      }
                    </div>
                    <Joiner joiner={this.state.joiner}/>
                    <div className="activeInfo">
                      <div className="a-course">
                        <p className="course-name">活动简介</p>
                        <p className="course-content">{this.state.active.summary}</p>
                        {
                          this.state.active.tag === '' || this.state.active.tag === null || this.state.active.tag === undefined ? '' :
                            (
                              <div className="label">
                                {
                                  this.state.active.tag.split('|').map((item, index) => {
                                    return (<span key={index}>{item}</span>)
                                  })
                                }
                              </div>
                            )
                        }
                      </div>
                      <div className="description" dangerouslySetInnerHTML={{__html: this.state.active.content}}></div>
                      {/*已结束，显示留言板判断*/}
                      {
                        this.state.active.status === 5 ? (
                          <div>
                            {
                              this.state.active.memberVOList !== null && this.state.active.memberVOList.length !== 0 ? (
                                <div>
                                  <p className="msg-name"><em className="iconfont">&#xe62f;</em> 留言板</p>
                                  <ul className="msg-board">
                                    {
                                      this.state.active.memberVOList !== null ? ( <DetailMsg msg={this.state.active.memberVOList}></DetailMsg> ) : ''

                                    }

                                  </ul>
                                </div>
                              ) : ''

                            }
                            {/*<ul className="msg-board">*/}
                            {/*{*/}
                            {/*this.state.active.memberVOList !== null ? ( <DetailMsg msg={this.state.active.memberVOList}></DetailMsg> ) : ''*/}

                            {/*}*/}

                            {/*</ul>*/}
                          </div>
                        ) : ''
                      }
                    </div>
                    {/*关注，结束，报名等操作按钮的判断*/}
                    {
                      this.state.active.joinActivityTag === 3 ? '' : (
                        <div>
                          {
                            this.state.dom.map((item, index) => {
                              let curDom;
                              if (this.state.active.status === 0) {
                                if (this.state.active.joinActivityTag === null) {
                                  curDom = <Button className='follow' onClick={this.follow.bind(this)}>关注</Button>
                                } else if (this.state.active.joinActivityTag === 0) {
                                  curDom = <Button className='follow'>已关注</Button>
                                }
                              } else if(this.state.active.status === 1) {
                                if (this.state.active.joinActivityTag === 1 || this.state.active.joinActivityTag === 2) {
                                  if (this.state.active.joinActivityTag === 1) {
                                    curDom = <Button className='follow' onClick={this.cancelOrder.bind(this)} >取消报名</Button>
                                  }
                                  if (this.state.active.joinActivityTag === 2) {
                                    curDom = <Button className={`follow ${this.state.timeOver ? 'disable' : ''}`} onClick={this.cancelOrder.bind(this)}>取消报名</Button>
                                  }
                                } else (
                                  curDom = <Button className='follow' onClick={this.sign.bind(this)}>报名</Button>
                                )
                              } else if(this.state.active.status === 2) {
                                if (this.state.active.joinActivityTag === 1 || this.state.active.joinActivityTag === 2) {
                                  if (this.state.active.joinActivityTag === 1) {
                                    curDom = <Button className='follow' onClick={this.cancelOrder.bind(this)} >取消报名</Button>
                                  }
                                  if (this.state.active.joinActivityTag === 2) {
                                    curDom = <Button className={`follow ${this.state.timeOver ? 'disable' : ''}`} onClick={this.cancelOrder.bind(this)}>取消报名</Button>
                                  }
                                } else (
                                  curDom = <Button className='follow' onClick={this.sign.bind(this)}>排队</Button>
                                )
                              }else if(this.state.active.status === 3) {
                                curDom = <Button className='follow'>报名已结束</Button>
                              }else if(this.state.active.status === 4) {
                                curDom = <Button className='follow'>活动进行中</Button>
                              }else if(this.state.active.status === 5) {
                                curDom = ''
                              }
                              return (<div key={index}>{curDom}</div>)
                            })

                          }
                        </div>
                      )
                    }

                    {/*可留言按钮的判断*/}
                    {
                      this.state.active.status === 5 && this.state.active.joinActivityTag === 2 ? (
                        <div className="msg-write" onClick={this.jumpTo.bind(this)}>
                          <em className="add iconfont">&#xe62f;</em>
                        </div>
                      ) : ''
                    }
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    );
  }
}

ActiveDetail.propTypes = {
};

export default connect()(ActiveDetail);
