import React from 'react';
import { connect } from 'dva';
import { Button, Toast } from 'antd-mobile';
import { Checkbox} from 'antd';
import { Link } from 'dva/router';
import qs from 'query-string'
import payoffAPI from '../../../../services/payoffAPI'
import weixinPayAPI from '../../../../services/weixinPayAPI.js'
import { fenToYuan } from '../../../../utils/dateFormat'
import './Payoff.less';
var wx = require('weixin-js-sdk');

class Payoff extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      time: '',
      money: '',
      checked: 1,
      disabled: 0,
      agree: true,
      payType: 0
    }
  }

  changeCheckBox (id) {
    this.setState({
      checked: id
    })
  }

  isAgree (id) {
    this.setState((oldState) => {
      return {
        agree: !oldState.agree
      }
    }, () => {
      this.setState({
        disabled: !this.state.agree
      })
    })
  }



  componentDidMount () {
    document.title = '确认支付'
    this.setState({
      money: localStorage.money,
      time: localStorage.year,
      type: localStorage.name,
      info: {}
    })
    /**
     * js-sdk 初始化
     * @type {[type]}
     */
    weixinPayAPI.init().then( (response) => {
      var wxConfig = {
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端swal出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: response.data.data['appId'], // 必填，公众号的唯一标识
        timestamp: response.data.data['timestamp'], // 必填，生成签名的时间戳
        nonceStr: response.data.data['nonceStr'], // 必填，生成签名的随机串
        signature: response.data.data['signature'], // 必填，签名，见附录1
        jsApiList: ['chooseWXPay']
      }

      wx.config(wxConfig);
    })
    wx.ready(function() {
      console.log('ready')
      wx.checkJsApi({
          jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function(res) {
            console.log(res.checkResult.chooseWXPay)
            if (!res.checkResult.chooseWXPay) {
              window.alert('当前微信客户端版本微信支付不可用，请升级微信客户端！')
            }
              // 以键值对的形式返回，可用的api值true，不可用为false
              // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          }
      });
    });

    wx.error(function(res) {
      console.log(res);
    });
  }

  // 支付
  payoff () {
    let isAgree = this.state.disabled
    let payType = this.state.checked
    if ( isAgree ) {
      return
    }
    if ( payType === 1 ) {
      this.wechatPay()
    } else {
      this.emCardPay()
    }
  }

  emCardPay () {
    let params
    if ( localStorage.id == 1 || localStorage.id == 4 ) {
      params= {
        productId: qs.parse(this.props.location.search).id,
        productType: 3,
        payType: 3,
      }
    }
    
    if ( localStorage.id == 7 || localStorage.id == 10 ) {
       let phone=qs.parse(this.props.location.search).phone
       let captcha=qs.parse(this.props.location.search).captcha
      params= {
        productId: qs.parse(this.props.location.search).id,
        productType: 3,
        payType: 3, 
        phone: phone,
        captcha: captcha,
      }
    }
    payoffAPI.emCardPay(params).then( res => {
      console.log(res)
    })
  }

  wechatPay () {
        payoffAPI.getNumber().then((res) => {
      let _this = this
        if( res.data.data.phone === "" ){
          this.props.history.push('/linkTo')
        } else {
          let phone=qs.parse(this.props.location.search).phone
          let captcha=qs.parse(this.props.location.search).captcha
          console.log(captcha)
          payoffAPI.getOrder({productId: localStorage.id , productType: 3, payType: 1,phone:phone,captcha:captcha}).then((res) => {
            console.log(res)
              window.localStorage.courseName = this.state.info.name
              window.localStorage.startTime = this.state.info.startTime
              window.localStorage.endTime = this.state.info.endTime
              window.localStorage.courseAddress = this.state.info.address
              window.localStorage.orderNum = this.state.info.orderNum
              wx.chooseWXPay({
                  timestamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.payPackage,
                  signType: res.data.data.signType,
                  paySign: res.data.data.sign,
                  success: function(res) {
                    console.log('成功')
                    Toast.success('支付成功', 2, () => {
                      _this.props.history.push('/survey')
                    }, true)
                },
                  fail: function(res) {
                    alert("支付发生异常！");
                  }
              })
          })
        }
    })
  }
  
  render() {
    return (
      <div className="payoff">
        <div className="combo">
          <span className="pay-combo">套餐</span>
          <span className="pay-yearcard">{this.state.type}/{this.state.time}</span>
        </div>
        <div className="price">
          <span className="pay-price">价格</span>
          <span className="pay-money">￥{fenToYuan(this.state.money)}</span>
        </div>
        <div className="pay-way">
          <h2>支付方式</h2>
           { /* <div className="methods">
            <i className="iconfont chuzhika">&#xe628;</i>
            <span>储值卡支付</span>
            <Checkbox className="check" onChange={this.changeCheckBox.bind(this, 2)} checked={this.state.checked === 2} />
          </div> */}
          <div className="methods">
            <i className="iconfont weixin">&#xe634;</i>
            <span>微信支付</span>
            <Checkbox className="check" onChange={this.changeCheckBox.bind(this, 1)} checked={this.state.checked === 1} />
          </div>
          <div className="clause">
            <Checkbox className="isAgree-btn" type="checkbox" onChange={this.isAgree.bind(this)} checked={this.state.agree} />
            <span className="agree">我已阅读并同意</span>
            <Link to='/declaration'>
              <span className="server-clause">X-COOL健身服务条款</span>
            </Link>
          </div>
        </div>
          <div className={`pay-now ${ this.state.disabled ? '' : 'active' }`} onClick={this.payoff.bind(this)}>立即支付</div>
      </div>
    )
  }
}

export default connect()(Payoff);
