import React from 'react';
import { connect } from 'dva';
import { Icon, Rate } from 'antd'
import './detailMsg.less';
import {dateFormat, allTurnTime} from '../../../utils/dateFormat'

class DetailMsg extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      star: [9, 9, 9, 9, 9]
    }
  }
  render() {
    let msg = this.props.msg
    return (
      <div>
        {
          msg.map((item, index) => {
            return (
              <li className="leave-msg" key={index}>
                <img className="img" src={item.avatar} alt=""/>
                <div className="msg">
                  <p>
                    <span className="msg-name">{item.nickName}</span>
                    <span className="msg-time">{allTurnTime(item.createTime)}</span>
                  </p>
                  <Rate className="start" disabled allowHalf defaultValue={item.score} />
                  <p className="feelWords">{item.content}</p>
                </div>
              </li>
            )
          })
        }
      </div>
    )
  }
}

DetailMsg.propTypes = {
};

export default connect()(DetailMsg);

//
// <li className="leave-msg">
//   <img className="img" src={msg.avatar} alt=""/>
//   <div className="msg">
//     <p>
//       <span className="msg-name">{msg.nickName}</span>
//       <span className="msg-time">`dateFormat($(msg.createTime))`</span>
//     </p>
//     <p className="start">
//       {
//         this.state.star.slice(`${msg.score}`).map((item, index) => {
//           return <Icon type="star" style={{marginRight:5+'px', color:'#F7BA2A'}} key={index}></Icon>
//         })
//       }
//     </p>
//     <p className="feelWords">{msg.content}</p>
//   </div>
// </li>