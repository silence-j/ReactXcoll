import React from 'react';
import { connect } from 'dva';
import { Radio, Checkbox, Button } from 'antd';
import { Link } from 'dva/router';
import personalInfoAPI from '../../../../../services/personalInfoAPI'
import qs from 'query-string'
import './Survey.less';

const RadioGroup = Radio.Group;

class Survey extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
      info: [
            { tit: '微信', },
            { tit: '大众点评' },
            { tit: '宣传单' },
            { tit: '广告' },
            { tit: '其他' },
      ],
      sellerName: '',
      checked: '',
    }
  }

  componentDidMount () {
     document.title = '调查问卷'
   }
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  // 将渠道进行存储，下个页面拿到改存储的值传到后台
  save() {
    localStorage.sell_way = this.state.value
    localStorage.seller = this.state.sellerName
    localStorage.ad = this.state.ad
  }

  seller(e) {
    let value = e.target.value
    this.setState({
      sellerName: value
    })
  }


  render() {
    return (
      <div className="container">
        <div className="questionnaire">
          <h3>请填写调查问卷帮助我们做的更好</h3>
          <h2>您从什么渠道了解到X-COOL?</h2>
          <RadioGroup onChange={this.onChange} value={this.state.value} className="radList" >
            <Radio className="radItem" value={1} style={{backgroundColor: this.state.value == 1 ? '#979797' : '#2C2E3A'}}>销售推荐
             {
               this.state.value == 1 &&
               ( <div className="saler-list">
                <lable className="saler">销售员:</lable>
                <input type="text"className="ipt" value={this.state.sellerName} onChange={this.seller.bind(this)} />
              </div>)
             }
            </Radio>
            <Radio className="radItem" value={2} style={{backgroundColor: this.state.value == 2 ? '#979797' : '#2C2E3A'}}>朋友介绍</Radio>
            <Radio className="radItem" value={3} style={{backgroundColor: this.state.value == 3 ? '#979797' : '#2C2E3A'}}>自助购买
              {
                this.state.value == 3 &&
                (<div className="buy-self">
                    <ul className="buy-list" >
                      <li className="buy-item">
                        <span>微信</span><Checkbox className="ckbox"/>
                      </li>
                      <li className="buy-item">
                        <span>大众点评</span><Checkbox className="ckbox" />
                      </li>
                      <li className="buy-item">
                        <span>宣传单</span><Checkbox className="ckbox"/>
                      </li>
                      <li className="buy-item">
                        <span>广告</span><Checkbox className="ckbox" />
                      </li>
                      <li className="buy-item">
                        <span>其他</span><Checkbox className="ckbox"/>
                      </li>
                    </ul>
                  </div>)
              }
            </Radio>
          </RadioGroup>
        </div>
        <Link to="/personalInfo">
          <Button type="primary" className="done" onClick={this.save.bind(this)}>完成</Button>
        </Link>
      </div>
    )
  }


}
export default connect()(Survey);
