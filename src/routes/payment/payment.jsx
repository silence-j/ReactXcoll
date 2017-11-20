import React from 'react';
import { connect } from 'dva';
import { NavLink } from 'dva/router'
import { Toast } from 'antd-mobile'
import './payment.less';
import qs from 'query-string'
import {dateFormat, TimeSec, fenToYuan} from '../../utils/dateFormat'
import courseAPI from '../../services/courseAPI.js'
import personalAPI from '../../services/personalAPI'
import weixinPayAPI from '../../services/weixinPayAPI.js'
import Loading from '../../components/Loading/Loading'
import { Button, Checkbox, Radio, message } from 'antd'
var wx = require('weixin-js-sdk');



class Payment extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      agree: true,
      info: {},
      activeInfo: {},
      str: '日一二三四五六',
    //  判断是否为会员0：非会员，1：会员，2：过期会员
      type: -1,
    //  支付方式 3：存储卡支付 2：支付宝支付(暂不支付支付宝) 1：微信支付
      payType: 0
    }
  }
  componentDidMount () {
    document.title = '确认支付'
    if (qs.parse(this.props.location.search).which === 'course') {
      let param = {scheduleId: qs.parse(this.props.location.search).id}
      this.getDetail(param)
    }
    if (qs.parse(this.props.location.search).which === 'active') {
      let param = {activityId: qs.parse(this.props.location.search).id}
      this.getActiveDetail(param)
    }
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
  //获取数据(精品团课)
  getDetail(param) {
    courseAPI.getCourseDetail(param).then((res) => {
      if (res.data.code === 0) {
        this.setState({
          info: res.data.data,
          type: qs.parse(this.props.location.search).type
        })
      }
    })
  }
  /**
   * 在付款成功后，查询最新课程状态，如果是排队中，则提示并跳转到列表
   */
  getDetailAndJump() {
    courseAPI.getCourseDetail({scheduleId: qs.parse(this.props.location.search).id}).then((res) => {
      if (res.data.code === 0) {
        let buyStatus = res.data.data.buyStatus
        /**
         * [如果处于排队中]
         */
        if (buyStatus === 1) {
          this.props.history.push(`/ysuccess?kindof=course&scheduleId=${qs.parse(this.props.location.search).id}&state=2`)
          // this.props.history.goBack(-1)
        } else {
          this.props.history.push({
            pathname: '/ysuccess',
            search: `?kindof=course&scheduleId=${qs.parse(this.props.location.search).id}`
          })
        }
      }
    })
  }

  //获取数据（活动）
  getActiveDetail(param) {
    personalAPI.getActiveDetail(param).then((res) => {
      if (res.data.code === 0) {
        this.setState({
          activeInfo: res.data.data,
          type: qs.parse(this.props.location.search).type
        })
      }
    })
  }
  change (value) {
    this.setState({
      payType: value.target.value
    })
  }
  //是否同意x-cool服务条款
  isCheck (e) {
    if (e.target.checked === true) {
      this.setState({
        agree: true
      })
    } else {
      this.setState({
        agree: false
      })
    }
  }
  //确认支付
  payoff () {
    let that = this
    let params = {}
    if (qs.parse(this.props.location.search).which === 'course') {
      params = {
        productId: this.state.info.scheduleId,
        //0:精品团课
        productType: 0,
        payType: this.state.payType
      }
    }
    if (qs.parse(this.props.location.search).which === 'active') {
      params = {
        productId: this.state.activeInfo.id,
        //2:活动
        productType: 2,
        payType: this.state.payType
      }
    }

    if (this.state.agree === true && this.state.payType !== 0) {
      courseAPI.getOrder(params).then((res) => {
        if (res.data.code === 0) {
          if (this.state.payType === 1) {
            var that = this
            wx.chooseWXPay({
                timestamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.payPackage,
                signType: res.data.data.signType,
                paySign: res.data.data.sign,
                success: function(res) {
                  Toast.success('支付成功', 2, () => {
                    courseAPI.getUserInfo().then(res => {
                      if(!res.data.code) {
                        if (res.data.data.height !== null) {
                          if (qs.parse(that.props.location.search).which === 'course') {
                            /**
                             * [如果处于排队中]
                             */
                             that.getDetailAndJump()
                          }
                          if (qs.parse(that.props.location.search).which === 'active') {
                            that.props.history.push({
                              pathname: '/ysuccess',
                              search: `?kindof=active&activityId=${qs.parse(that.props.location.search).id}`
                            })
                          }
                        } else {
                          if (qs.parse(that.props.location.search).which === 'course') {
                            localStorage.source = 'course'
                            localStorage.sourceId = qs.parse(that.props.location.search).id
                            that.props.history.push({
                              pathname: '/survey',
                              // search: `?source=course&scheduleId=${qs.parse(that.props.location.search).id}`
                            })
                          }
                          if (qs.parse(that.props.location.search).which === 'active') {
                            localStorage.source = 'active'
                            localStorage.sourceId = qs.parse(that.props.location.search).id
                            that.props.history.push({
                              pathname: '/survey',
                              // search: `?source=active&activityId=${qs.parse(that.props.location.search).id}`
                            })
                          }
                        }
                      }
                    })
                  }, true)
              },
                fail: function(res) {
                  alert("支付发生异常！");
                }
            })
          }
          else if (this.state.payType === 3) {
            Toast.success('支付成功', 2, () => {
              courseAPI.getUserInfo().then(res => {
                if(!res.data.code) {
                  if (res.data.data.height !== null) {
                    if (qs.parse(this.props.location.search).which === 'course') {
                       this.getDetailAndJump()
                    }
                    if (qs.parse(this.props.location.search).which === 'active') {
                      this.props.history.push({
                        pathname: '/ysuccess',
                        search: `?kindof=active&activityId=${qs.parse(this.props.location.search).id}`
                      })
                    }
                  } else {
                    if (qs.parse(this.props.location.search).which === 'course') {
                      localStorage.source = 'course'
                      localStorage.sourceId = qs.parse(this.props.location.search).id
                      this.props.history.push({
                        pathname: '/survey',
                        // search: `?source=course&scheduleId=${qs.parse(this.props.location.search).id}`
                      })
                    }
                    if (qs.parse(this.props.location.search).which === 'active') {
                      localStorage.source = 'active'
                      localStorage.sourceId = qs.parse(this.props.location.search).id
                      this.props.history.push({
                        pathname: '/survey',
                        // search: `?source=active&activityId=${qs.parse(this.props.location.search).id}`
                      })
                    }
                  }
                }
              })
            }, true)
          }
        } else {
          alert(res.data.message)
        }
      })
    }
  }
  render() {
    const whichType = qs.parse(this.props.location.search).which
    const virtualBalance = qs.parse(this.props.location.search).virtualBalance
    const RadioGroup = Radio.Group;
    let money;
    if(this.state.type !== '1') {
      if (whichType === 'course') {
         money = `${fenToYuan(this.state.info.price)}`
      } else {
         money = `${fenToYuan(this.state.activeInfo.commonPrice)}`
      }
    } else {
      if (whichType === 'course') {
         money = `${fenToYuan(this.state.info.memberPrice)}`
      } else {
         money = `${fenToYuan(this.state.activeInfo.memberPrice)}`
      }
    }
    console.log('lplp')
    console.log(money)
    return (
      <div className="P-container">
        <div className="pay-info">
          <p className="info">
            <span className="info-left">{
              whichType === 'course' ? '精品团课' : '活动'
            } :</span>
            <span className="info-right">
              {
                whichType === 'course' ? this.state.info.name : this.state.activeInfo.title
              }
            </span>
          </p>
          <p className="info info-dis">
            <span className="info-left">时间 :</span>
            {
              whichType === 'course' ? (
                <span className="info-right">{dateFormat(this.state.info.startTime).substr(5).replace('-','.')}(周{this.state.str[new Date(dateFormat(this.state.info.startTime)).getDay()]})/{TimeSec(this.state.info.startTime)}~{TimeSec(this.state.info.endTime)}</span>
              ) : (
                <span className="info-right">{dateFormat(this.state.activeInfo.startTime).substr(5).replace('-','.')}(周{this.state.str[new Date(dateFormat(this.state.activeInfo.startTime)).getDay()]})/{TimeSec(this.state.activeInfo.startTime)}~{dateFormat(this.state.activeInfo.endTime).substr(5).replace('-','.')}/{TimeSec(this.state.activeInfo.endTime)}</span>
              )
            }
          </p>
          <p className="info info-dis">
            <span className="info-left">地点 :</span>
            <span className="info-right">{
              whichType === 'course' ? this.state.info.address : this.state.activeInfo.address
            }</span>
          </p>
          <p className="info info-dis">
            <span className="info-left">价格 :</span>
            <span className="info-right prince"><span style={{fontSize: '1rem'}}>￥</span>
              {this.state.type !== '1' ? <span>
                {
                  whichType === 'course' ? `${fenToYuan(this.state.info.price)}` : `${fenToYuan(this.state.activeInfo.commonPrice)}`
                }
              </span> : <span>
                {
                  whichType === 'course' ? `${fenToYuan(this.state.info.memberPrice)}` : `${fenToYuan(this.state.activeInfo.memberPrice)}`
                }
              </span>}
            </span>
          </p>
          {
            this.state.type !== '1' ? (
              <p className="member">
            <span className="be-member">
              成为 <NavLink to="/index/clubCard">X-COOL</NavLink>会员,享受更低团课优惠 <em></em>
            </span>
              </p>
            ) : ''
          }
        </div>
        <div className="payFor">
          <p className="type-for">支付方式</p>
          <div className="pay-infor">
            {
              virtualBalance !== '' && virtualBalance !== null &&  +virtualBalance > money &&
              <p className="money-from">
                <span className="card"><em className="iconfont emCard">&#xe628;</em>储值卡支付</span>
              </p>
            }
            {/*<p className="money-from">*/}
              {/*<span className="card"><em className="iconfont zfb">&#xe638;</em>支付宝支付</span>*/}
            {/*</p>*/}
            <p className="money-from">
              <span className="card"><em className="iconfont wx">&#xe634;</em>微信支付</span>
            </p>
            <div className="choose-info">
              <RadioGroup onChange={this.change.bind(this)} className="group">
                {(virtualBalance !== '' && virtualBalance !== null &&  +virtualBalance > money ) && <Radio className="choose" value={3}></Radio> }
                {/*<Radio className="choose" value={2}></Radio>*/}
                <Radio className="choose" value={1}></Radio>
              </RadioGroup>
            </div>
          </div>
          <p className="agree">
            <Checkbox onChange={this.isCheck.bind(this)} defaultChecked={this.state.agree}></Checkbox>
            <span>我已阅读并同意 <NavLink to="/declaration">X-COOL健身服务条款</NavLink></span>
          </p>
        </div>
        <Button className={`payit ${this.state.agree === true && this.state.payType !== 0 ? 'payColor' : ''}`} onClick={this.payoff.bind(this)}>确认支付</Button>
      </div>
    )
  }
}

Payment.propTypes = {
};

export default connect()(Payment);
