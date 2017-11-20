import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { NavLink } from 'dva/router'
import Lunbo from './carousel/carsouel.jsx'
import './style.less';
import partyAPI from '../../../../services/partyAPI.js'
import authInit from '../../../../utils/auth.js'

import { dateFormat, fenToYuan } from '../../../../utils/dateFormat'
import Loading from '../../../../components/Loading/Loading'


class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      parties: [],
      isLoading: false,
      isData: true,
      currentPage: 1,
      loadingMore: false,
      hasMore: true
    }
    
  }
  componentDidMount () {
    document.title = '活动列表'
    this.setState({
      isLoading: true,
      isData: true
    })
    authInit(window).then( res => { 
      partyAPI.getParties({ page: 1 }).then( res => {
        if (!res.data.code) {
          if(res.data.data.records !== null && res.data.data.records.length !== 0) {
            let currentPage = this.state.currentPage
            let hasMore = res.data.data.totalPages > currentPage ? true : false
            this.setState({
              isLoading:false,
              parties: res.data.data.records,
              hasMore
            })
          } else {
            this.setState({
              isLoading:false,
              isData: false
            })
          }

        }
      })
    })
  }
  //跳转公司详情
  jumpToDetail (id) {
    this.props.history.push({
      pathname: '/activeDetail',
      search: `?id=${id}`
    })
  }
  scrollFunc () {
    let el = this.el
    let elHeight = el.clientHeight
    let elScroll = el.scrollTop
    let elScrollHeight = el.scrollHeight
    let loadingMore = this.state.loadingMore
    let arr = this.state.parties
    let currentPage = this.state.currentPage + 1
    let hasMore = this.state.hasMore
    if (((elScroll + elHeight + 20) > elScrollHeight) && !loadingMore && (arr.length > 9) && hasMore) {
      this.setState({
        loadingMore: true
      }, () => {
        partyAPI.getParties({ page: currentPage }).then( res => {
          if (!res.data.code) {
            if(res.data.data.records !== null && res.data.data.records.length !== 0) {
              hasMore = res.data.data.totalPages > currentPage ? true : false
              this.setState({
                parties: arr.concat(res.data.data.records),
                loadingMore: false,
                currentPage,
                hasMore
              })
            }
          }
        })
      })
    }
  }
  render() {
    return (
      <div className="active-view" ref={el => this.el = el} onScroll={this.scrollFunc.bind(this)}>
        {
          this.state.isLoading === false ? (
            <div>
              {
                this.state.isData ? (
                  <div>
                    <Lunbo banner={Array.from(this.state.parties)}></Lunbo>
                    <ul className="content-box">
                      {
                        this.state.parties.map( (item,index) => {
                          let stateDom;
                          if (item.status === 1) {
                            stateDom = <div className="sign-up"><span>报名中</span></div>
                          } else if (item.status === 0) {
                            stateDom = <div className="to-expect"><span>敬请期待</span></div>
                          } else if (item.status === 2) {
                            stateDom = <div className="sign-up"><span>排队中</span></div>
                          } else if (item.status === 5) {
                            stateDom = <div className="ended"><span>已结束</span></div>
                          } else if (item.status === 3) {
                            stateDom = <div className="to-expect"><span>报名截止</span></div>
                          } else if (item.status === 4) {
                            stateDom = <div className="sign-up"><span>进行中</span></div>
                          }
                          return (
                            <li className="content-one" key={item.id} onClick={this.jumpToDetail.bind(this, item.id)}>
                              <div className="pic">
                                {stateDom}
                                {
                                  item.cover !== null && item.cover !== '' ? <img src={item.cover}/> : <img src={require('../../../../assets/defaultCarsouel.png?x-oss-process=image/resize,h_120')}/>
                                }
                              </div>
                              <div className="content-bottom">
                                <h3>{item.title}</h3>
                                <p>{item.summary|| '暂无活动介绍'}</p>
                                <ul>
                                  <i className="iconfont time1">&#xe610;</i>
                                  <span>{dateFormat(item.startTime)}</span>
                                  <i className="iconfont address1">&#xe60f;</i>
                                  <span>{item.address}</span>
                                </ul>
                              </div>
                            </li>

                          )
                        })
                      }
                    </ul>
                    {
                      this.state.parties.length > 9 &&
                      <div className="load-more">
                        {this.state.hasMore ? '正在加载...' : '已经到底了...'}
                      </div>
                    }
                  </div>
                ) : (
                  <div className="no-records">
                    <img src={require('../../../../assets/nodata/record.png')} alt=""/>
                    <p>暂时还没有记录哦</p>
                  </div>
                )
              }
            </div>

          ):(
            <Loading top="15"></Loading>
          )
        }

      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
