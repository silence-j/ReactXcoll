import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd'
import './detailMsg.less';
import Enlarger from '../../../social/show/hot/enlarger/enlarger'
import {allTurnTime} from '../../../../utils/dateFormat'

class DetailMsg extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      isLarger: false,
      resultArr: []
    }
  }
  big (msg, itemIndex, index) {
    let curarr
    let change = []
    curarr = msg[itemIndex].evaluateImg.split(';')
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
  beLarger () {
    this.setState({
      isLarger: false
    })
  }
  render() {
    let msg = this.props.msg
    return (
      <div>
        {
          this.state.isLarger && <Enlarger image={this.state.resultArr} largerTo={this.beLarger.bind(this)}></Enlarger>
        }
        {
          msg.map((item, ItemIndex) => {
            return (
              <li className="leave-msg" key={ItemIndex}>
                <img className="img" src={item.avatar} alt=""/>
                <div className="msg">
                  <p>
                    <span className="msg-name">{item.nickName}</span>
                    <span className="msg-time">{allTurnTime(item.createTime)}</span>
                  </p>
                  <p className="feelWords">{item.comment}</p>
                  {
                    item.evaluateImg !== null && item.evaluateImg.length !== 0 ? (
                        <ul className="msg-ul">
                          {
                            item.evaluateImg.split(';').map((item, index) => {
                              return (<li key={index} onClick={this.big.bind(this, msg, ItemIndex, index)}>
                                <img src={item} alt=""/>
                              </li>)
                            })
                          }
                        </ul>
                    ) : ''
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

DetailMsg.propTypes = {
};

export default connect()(DetailMsg);
