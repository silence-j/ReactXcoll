import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd'
import './comment.less';
import {dateFormat, allTurnTime} from '../../../../../utils/dateFormat'

class Comment extends React.Component {
  constructor (props) {
    super (props)
    this.state = {

    }
  }
  reply (commentId, postId) {
    this.props.replyThis(commentId, postId)
  }
  render() {
    let msg = this.props.content
    return (
      <div>
        {
          msg.map((item,index) => {
            return (
              <li className="comment-msg" key={item.id}>
                {
                  item.avatar !== null && item.avatar !== '' ? <img className="img" src={item.avatar} alt=""/> : <img className="img" src={require('../../../../../assets/defaultAvtar.png?x-oss-process=image/resize,h_42')} alt=""/>
                }
                <div className="msg">
                  <p onClick={this.reply.bind(this,item.id,item.postId)}>
                    <span className="msg-name">{item.nickName}</span>
                    <span className="msg-time">{allTurnTime(item.createTime)}</span>
                  </p>
                  <p className="feelWords">{item.content}</p>
                  {
                    item.postCommentReplyVOList.map((reItem, index) => {
                      return (
                        <p className="replay" key={reItem.id}>
                          回复 <span className="comment-name">{reItem.nickName}</span> {reItem.content}
                        </p>
                      )
                    })
                  }
                </div>
              </li>
            )
          })
        }
      </div>
    )
  }
}

Comment.propTypes = {
};

export default connect()(Comment);
