import React from 'react';
import { connect } from 'dva';
import './style.less';
import accountAPI from '../../../services/accountAPI.js'
import authInit from '../../../utils/auth.js'
import { allTurnTime, fenToYuan } from '../../../utils/dateFormat'


class Expense extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      remain: '0.00',
      kind: null,
      consume: [],
    }

  }
  componentDidMount () {
    document.title = '消费记录'
    authInit(window).then( res => {
      accountAPI.getUerInfo().then( res => {
        this.setState({
          remain: res.data.data.virtualBalance
        })
      })
      accountAPI.getbuyList().then( res => {
        let obj = res.data.data
        let kind
        let isAdd
        let income
        for (let item of obj) {
          if ( item.accountTypeId == 1 ) {
            kind = "微信"
            isAdd= "-"
            income= "支出"
          } else if(item.accountTypeId == 2) {
            kind = "储值卡"
            isAdd= "-"
            income="支出"
          } else if(item.accountTypeId == 3) {
            kind = "储值卡"
            isAdd= "+"
            income= "收入"
          } else if(item.accountTypeId == 4) {
            kind = "储值卡"
            isAdd= "+"
            income="收入"
          } else if(item.accountTypeId == 5) {
            kind = "储值卡"
            isAdd= "-"
            income="支出"
          }
          item.kind = kind
          item.isAdd = isAdd
          item.income = income
        }
        console.log(obj)
        this.setState({
          consume: obj,
        })
      })
    })
    
  }

  render() {
    return (
      <div className="container">
        <div className="con-top">
          <span><i className="iconfont">&#xe619;</i>储值卡余额（元）</span>
          <p className="remaining">{fenToYuan(this.state.remain)}</p>
        </div>
        <div className="consume">
          <h2>消费明细</h2>
          <ul className="consume-list">{
            this.state.consume.map((item,index) => {
              return (
                <li className="consume-item" key={index}>
                  <div className="item-left">
                    <p className="project">{item.income}—{item.descrption}</p>
                    <p className="date">{allTurnTime(item.createTime)}</p>
                  </div>
                  <div className="item-mid">{item.kind}</div>
                  <div className="item-right">
                    <p className="count" style={{color: item.isAdd == '+' ? '#FCCB51' : '#FFFFFF'}}>{item.isAdd}{fenToYuan(item.amount)}</p>
                    { item.kind == '储值卡' &&
                      <p className="total">{fenToYuan(item.virtualBalance)}</p>
                    }
                  </div>
                </li>
              )
            })
          }
          </ul>
        </div>
      </div>
    )
  }
}

export default connect()(Expense);
