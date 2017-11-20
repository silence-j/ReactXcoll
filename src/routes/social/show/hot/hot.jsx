import React from 'react';
import { connect } from 'dva';
import { Route, NavLink } from 'dva/router';
import { Icon } from 'antd'
import { Modal } from 'antd-mobile'
import { dateFormat, allTurnTime } from '../../../../utils/dateFormat'
import personalAPI from '../../../../services/personalAPI'
import Loading from '../../../../components/Loading/Loading'
import Comment from './comment/comment'
import Enlarger from './enlarger/enlarger'
import enCode from '../../../../utils/enCode'
import authInit from '../../../../utils/auth.js'

import './style.less';


class IndexPage extends React.Component {
  constructor (props) {
    super(props)
		this.state = {
      isActive: true,
      isPost: true,
    	//活跃用户
    	active: [],
      //热门帖子
      postList: [],
      postId: '',
      type: '',
      commentId: '',
      clientTop: 0,
      isLarger: false,
      resultArr: [],
      hotData: true,
      postData: true
		}
  }
  componentDidMount () {
    document.title = '酷社区'
    authInit(window).then( res => {
      //  获取活跃用户
      this.getActiveUser()
      //获取帖子列表
      let params = {
        queryType: 0,
        page: 1,
        size: 10000
      }
      this.postList(params)
    } )
  }
  getActiveUser () {
    this.setState({
      isActive: true,
      hotData: true
    })
    personalAPI.getActiveUser().then(res => {
    	console.log(res)
      if(!res.data.code) {
        if (res.data.data !== null && res.data.data.length !== 0) {
          this.setState({
            active: res.data.data,
            isActive: false
          })
        } else {
          this.setState({
            isActive: false,
            hotData: false
          })
        }
      }
    })
  }
  postList (params) {
    this.setState({
      isPost: true,
      postData: true
    })
    personalAPI.getPostList(params).then(res => {
    	console.log(res)
    	if(!res.data.code) {
    	  if (res.data.data.records !== null && res.data.data.records.length !== 0) {
          this.setState({
            postList: res.data.data.records,
            isPost: false
          })
          window.scrollTo(0, this.state.clientTop)
        } else {
          this.setState({
            isPost: false,
            postData: false
          })
        }
      }
    })
  }
  //评论
  comment (id) {
    this.setState({
      clientTop: document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
    },() => {
      Modal.prompt(
        '',
        '',
        [
          { text: '取消' ,
            onPress: (val) => {
              this.postTo(val, 'notOk')

            }
          },
          {
            text: '提交',
            onPress: (val) => {
              this.postTo(val, 'ok', '评论', id)
              console.log(val)
            }
          },
        ],
        'default', null,
        ['评论']
      )
    })
    console.log('PPPPPPPPPPP')
    console.log(this.state.clientTop)
  }
  postTo (value, operation, type, postId, commentId) {
    if (operation === 'ok') {
      if (type === '评论') {
        personalAPI.postComment({postId: postId, content: value}).then(res => {
          if(!res.data.code) {
            authInit(window).then( res => {
              //获取帖子列表
              let params = {
                queryType: 0,
                page: 1,
                size: 10000
              }
              this.postList(params)
            } )
          }
        })
      }else if (type === '回复') {
        personalAPI.postReply({postId: postId, commentId: commentId, content: value}).then(res => {
          if(!res.data.code) {
            authInit(window).then( res => {
              //获取帖子列表
              let params = {
                queryType: 0,
                page: 1,
                size: 10000
              }
              this.postList(params)
            } )

          }
        })
      }
    } else if (operation === 'notOk'){

    }


  }
  //回复
  replyTo (commentId, postId) {
    this.setState({
      clientTop: document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
    }, () => {
      Modal.prompt(
        '',
        '',
        [
          { text: '取消' ,
            onPress: (val) => {
              this.postTo(val, 'notOk')

            }
          },
          {
            text: '提交',
            onPress: (val) => {
              this.postTo(val, 'ok', '回复', postId, commentId)
              console.log(val)
            }
          },
        ],
        'default', null,
        ['回复']
      )
    })
  }
  //点赞
  isLike (id, isLike, index) {
    let arr = this.state.postList
    if (isLike === 0) {
      personalAPI.praise({postId: id, likeTag: 0}).then(res => {
        if (!res.data.code) {
          arr[index].praiseCount++
          arr[index].likeTag = 1
          this.setState({
            postList: arr
          })
        }
      })
    } else if(isLike === 1) {
      personalAPI.praise({postId: id, likeTag: 1}).then(res => {
        if (!res.data.code) {
          arr[index].praiseCount--
          arr[index].likeTag = 0
          this.setState({
            postList: arr
          })
        }
      })
    }
  }
  //放大图片
  beLarger () {
    this.setState({
      isLarger: false
    })
  }
  bigImage (itemIndex, index) {
    let curarr
    let change = []
    curarr = this.state.postList[itemIndex].pic.split(';')
    if (curarr.length === 1) {
      this.setState({
        resultArr: curarr,
        isLarger: true
      })
    } else {
      change = curarr.splice(0, index)
      this.setState({
        resultArr: curarr.concat(change),
        isLarger: true
      })
    }
  }
  render() {
    return (
      <div className="hot-view">
        {
          this.state.isLarger && <Enlarger image={this.state.resultArr} largerTo={this.beLarger.bind(this)}></Enlarger>
        }
        {
          this.state.isPost === false && this.state.isActive === false ? (
            <div>
              {
                this.state.hotData && this.state.postData ? (
                  <div className="hot-padding">
                    <ul className="people-box">
                      {
                        this.state.active.map((item, index) => {
                          return (
                            <li key={index}>
                              {
                                item.avatar !== null && item.avatar !== '' ? (
                                  <div className="heade-pic">
                                    <img src={item.avatar} alt=""/>
                                  </div>
                                ) : (
                                  <div className="heade-pic">
                                    <img src={require('../../../../assets/defaultAvtar.png?x-oss-process=image/resize,h_42')} alt=""/>
                                  </div>
                                )
                              }
                              {
                                item.name !== '' && item.name !== null ? (
                                  <span>{item.nickName}</span>
                                ) : <span></span>
                              }

                            </li>
                          )
                        })
                      }
                    </ul>
                    {
                      this.state.postList.map((item, itemindex) => {
                        return (
                          <ul className="hot-content" key={item.id}>
                            <li className="left-pic">
                              {
                                item.avatar !== null && item.avatar !== '' ? <img src={item.avatar} alt=""/> : <img src={require('../../../../assets/defaultAvtar.png')} alt=""/>
                              }
                            </li>
                            <li className="right-content">
                              <p>{item.nickName}</p>
                              <p dangerouslySetInnerHTML={{__html: enCode(item.content)}}></p>
                              {
                                item.pic !== null && item.pic !== '' ? (
                                  <ul className="picture">
                                    {
                                      item.pic.split(';').map((item2, index) => {
                                        return (
                                          <li key={index} onClick={this.bigImage.bind(this,itemindex,index)}>
                                            <img src={item2} alt=""/>
                                          </li>
                                        )
                                      })
                                    }
                                  </ul>
                                ) : ''
                              }
                              <ul className="bottom-info">
                                <li>{allTurnTime(item.createTime)}</li>
                                <li>
                                  <i  className={`iconfont ${item.likeTag === 1 ? 'isLike' : '' }`}>&#xe625;</i>
                                  <span onClick={this.isLike.bind(this, item.id, item.likeTag, itemindex)}>{item.praiseCount}</span>
                                  <i className="iconfont" >&#xe626;</i>
                                  <span onClick={this.comment.bind(this, item.id)}>{item.commentCount}</span>
                                </li>
                              </ul>
                            </li>
                            {
                              item.postCommentVOList !== null && item.postCommentVOList.length !== 0 ?
                                (
                                  <div className="comment-all">
                                    <span className="belongTo"></span>
                                    <Comment content={item.postCommentVOList} replyThis={this.replyTo.bind(this)}></Comment>
                                  </div>
                                ) : ''
                            }
                          </ul>
                        )
                      })
                    }
                    <NavLink to="/release" className="jump-To">
                      <div className="release">
                        <Icon type="plus" className="add"></Icon>
                      </div>
                    </NavLink>
                  </div>
                ) : (
                  <div className="no-records">
                    <img src={require('../../../../assets/nodata/record.png')} alt=""/>
                    <p>暂时还没有记录哦</p>
                    <NavLink to="/release" className="jump-To">
                      <div className="release">
                        <Icon type="plus" className="add"></Icon>
                      </div>
                    </NavLink>
                  </div>
                )
              }
            </div>
          ):(<Loading top="15"></Loading>)
        }
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
