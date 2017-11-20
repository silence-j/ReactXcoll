import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { NavLink } from 'dva/router'
import personalAPI from '../../../../services/personalAPI'
import { dateFormat, allTurnTime } from '../../../../utils/dateFormat'
import Loading from '../../../../components/Loading/Loading'
import Comment from './../hot/comment/comment'
import { Modal } from 'antd-mobile'
import Enlarger from './../hot/enlarger/enlarger'
import enCode from '../../../../utils/enCode'
import authInit from '../../../../utils/auth.js'

const alert = Modal.alert;

import './style.less';


class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      postList: [],
      isLoading: true,
      isLarger: false,
      type: '',
      postId: '',
      clientTop: 0,
      isData: true
    }
  }
  componentDidMount () {
    document.title = '活动'
    //获取帖子列表
    let params = {
      queryType: 1,
      page: 1,
      size: 10000
    }
    authInit(window).then( res => {
      this.postList(params)
    })
  }
  postList (params) {
    this.setState({
      isLoading: true,
      isData: true
    })
    personalAPI.getPostList(params).then(res => {
      if(!res.data.code) {
        if (res.data.data.records !== null && res.data.data.records.length !== 0) {
          this.setState({
            isLoading: false,
            postList: res.data.data.records
          })
          window.scrollTo(0, this.state.clientTop)
        } else {
          this.setState({
            isLoading: false,
            isData: false
          })
        }

      }
    })
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
  //评论
  mineComment (id) {
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
              this.postTo(val, 'ok', '评论', id)
              console.log(val)
            }
          },
        ],
        'default', null,
        ['评论']
      )
    })
  }
  postTo (value, operation, type, postId, commentId) {
    if (operation === 'ok') {
      if (type === '评论') {
        personalAPI.postComment({postId: postId, content: value}).then(res => {
          if(!res.data.code) {
            // this.setState({
            //   clientTop: document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
            // })

            authInit(window).then( res => {
              //获取帖子列表
              let params = {
                queryType: 1,
                page: 1,
                size: 10000
              }
              this.postList(params)
            })
          }
        })
      }else if (type === '回复') {
        personalAPI.postReply({postId: postId, commentId: commentId, content: value}).then(res => {
          if(!res.data.code) {
            // this.setState({
            //   clientTop: document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
            // })
            authInit(window).then( res => {
              //获取帖子列表
              let params = {
                queryType: 1,
                page: 1,
                size: 10000
              }
              this.postList(params)
            })
          }
        })
      }
    } else if (operation === 'notOk'){
      console.log('cancel')
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
  mineLike (id, isLike, index) {
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
  //删除帖子
  delPost (id, index) {
    console.log(id)
    console.log(index)
    let that = this
    alert('', '确定要删除吗？', [
      {
        text: '取消',
        onPress: () => console.log('cancel')
      },
      {
        text: '确定',
        onPress: () => that.del(id, index)
      }
    ])
  }
  del(id, index) {
    personalAPI.postDel({postId: id}).then(res => {
      if (!res.data.code) {
        let arr
        arr = this.state.postList
        arr.splice(index, 1)
        this.setState({
          postList: arr
        })
      }
    })
  }
  render() {
    return (
      <div className="mine-view">
        {
          this.state.isLarger && <Enlarger image={this.state.resultArr} largerTo={this.beLarger.bind(this)}></Enlarger>
        }
        {
          this.state.isLoading ? (
            <Loading top="15"></Loading>
          ) : (
            <div>
              {
                this.state.isData ? (
                  <div>
                    {
                      this.state.postList.map((item, itemindex) => {
                        return (
                          <ul className="hot-content" key={itemindex}>
                            <li className="left-pic">
                              <img src={item.avatar} alt=""/>
                            </li>
                            <li className="right-content">
                              <p>{item.nickName} <em onClick={this.delPost.bind(this, item.id, itemindex)} style={{float:'right'}} className="iconfont">&#xe608;</em></p>
                              <p dangerouslySetInnerHTML={{__html: enCode(item.content)}}></p>
                              {
                                item.pic !== null && item.pic !== '' ? (
                                  <ul className="picture">
                                    {
                                      item.pic.split(';').map((picItem, index) => {
                                        return (
                                          <li key={index} onClick={this.bigImage.bind(this,itemindex,index)}>
                                            <img src={picItem} alt=""/>
                                          </li>
                                        )
                                      })
                                    }
                                  </ul>
                                ) : ''
                              }

                              <div className="bottom-info">
                                <span>{allTurnTime(item.createTime)}</span>
                                <div>
                          <span className="comment-off isMargin" onClick={this.mineLike.bind(this, item.id, item.likeTag, itemindex)}>
                            <i className={`iconfont ${item.likeTag === 1 ? 'isLike' : '' }`}>&#xe625;</i>
                            <span >{item.praiseCount}</span>
                          </span>
                                  <span className="comment-off" onClick={this.mineComment.bind(this, item.id)}>
                            <i className="iconfont">&#xe626;</i>
                            <span>{item.commentCount}</span>
                          </span>
                                </div>
                              </div>
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
                  </div>
                ) : (
                  <div className="no-records">
                    <img src={require('../../../../assets/nodata/nodata.png?x-oss-process=image/resize,h_48')} alt=""/>
                    <p>暂时还没有记录哦</p>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    )
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
