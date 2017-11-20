import React from 'react';
import { connect } from 'dva';
import { Route, NavLink } from 'dva/router';
import { Button, Radio } from 'antd'
import { Checkbox } from 'antd-mobile'
import qs from "query-string"
import './style.less';
import teacherinfo from "../../../services/teacherAPI.js"
import weixinPayAPI from '../../../services/weixinPayAPI.js'

var wx = require('weixin-js-sdk')
import { Toast, WhiteSpace, WingBlank} from 'antd-mobile'



class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state={
    	lessonCount:1,
    	lessonType:0,
    	amountprice:1000,
    	priceStr:"",
    	payflag:0,
    	checkflag:0,
      isChecked: 1,
      priceList: {},
      isAgree: true,
      ispay:false
     }
  }
  
  whatprice (type,num){
    let priceList = this.state.priceList
    var amountList = {};
    let arr = type == 7 ? priceList.featureList : priceList.normalList
    let keyList = []
    for(let item of arr) {
      amountList[item.count] = (item.price / 100).toFixed(2)
      keyList.push(item.count)
    }
    var price = 0;
    var priceStr = "";
    // 判断数字对应的栏目
    for(var k in keyList){
      k = parseInt(k);
      if(num == keyList[k]){
        price = (keyList[k] * (amountList[keyList[k]] * 100)) / 100;
        priceStr = `${amountList[keyList[k]]} /课时 X ${keyList[k]} 节`;
      }else if(num > keyList[k] && num < keyList[k+1]){
        price = ((keyList[k] * (amountList[keyList[k]] * 100)) + ((num-keyList[k]) * (amountList[keyList[k+1]] * 100))) / 100;
        priceStr = `${amountList[keyList[k]]} /课时 X ${keyList[k]}  节+ ${amountList[keyList[k+1]]} /课时 X ${(num-keyList[k])} 节`
      }
    }

    return {'price':price,'priceStr':priceStr};
  }
  
  componentDidMount (){
    document.title="确认支付"
    teacherinfo.getprice().then(res => {
      this.setState({
        priceList: res.data.data
      })
      let lessonCountNew=(qs.parse(this.props.location.search)).count
      let lessonTypeNew=(qs.parse(this.props.location.search)).type
      var result = this.whatprice(lessonTypeNew,lessonCountNew)
      this.setState({
        lessonCount:parseInt(lessonCountNew),
        lessonType:lessonTypeNew,
        amountprice:result.price,
        priceStr:result.priceStr
      })
      
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
    })
		
  }
  
  payNow (){
    let isAgree = this.state.isAgree
    let ispay = this.state.ispay
    let payType = this.state.isChecked
    if (!isAgree) {
      return
    }
    if (ispay) {
    	console.log(888)
      this.wechatPay()
    }
  }
  
  emCardPay () {
    console.log('card')
    let params = {
      productId: localStorage.getItem('coachId'),
      productType: 1,
      productCategory: qs.parse(this.props.location.search).type,
      payType: 3,
      count: this.state.lessonCount
    }
    weixinPayAPI.emCardPay(params).then(res => {
      if (!res.data.code) {
        console.log(res)
        this.props.history.go(-2)
      }
    })
  }

  wechatPay () {
        let that = this
        let params = {
          productId: localStorage.teacherflag,
          productType: 1,
          productCategory: this.state.lessonType,
          count: this.state.lessonCount,
          payType: 1
        }
        teacherinfo.wxpay(params).then((res) =>{
          wx.chooseWXPay({
                    timestamp: res.data.data.timeStamp,
                    nonceStr: res.data.data.nonceStr,
                    package: res.data.data.payPackage,
                    signType: res.data.data.signType,
                    paySign: res.data.data.sign,
                    success: function(res) {
                      console.log('成功')
                      Toast.success('支付成功',2,()=>{
                      	teacherinfo.issurvey().then((res) =>{
                      	
                      	var vipinfo=res.data.data
                      	if(vipinfo.height===null){
                      				localStorage.source="wpay"
		                      		that.props.history.push('/survey')
                      	}else{
                      		that.props.history.go(-2)
                      	}
                      })
                     })
                      
                  },
                    fail: function(res) {
                      alert("支付发生异常！");
                    }
                })
        })
  }

  changeCountL (){
  	var count2 = this.state.lessonCount
  	if(count2 > parseInt((qs.parse(this.props.location.search)).count)){
  		count2 = count2 - 1
      var newpriceL = this.whatprice(this.state.lessonType,count2)
  			this.setState({
  				lessonCount: count2,
  				amountprice: newpriceL.price,
  				priceStr: newpriceL.priceStr
  			})
  			
   	}
  	
  }
  
  changeCountR (){
  	var count1 = this.state.lessonCount
  	count1 += 1
  	var newpriceR = this.whatprice(this.state.lessonType,count1)
  	this.setState({
  		lessonCount: count1,
  		amountprice: newpriceR.price,
  		priceStr: newpriceR.priceStr
  	})
  }
  
  changeCheck (index, e) {
    let checked = e.target.checked
    if(this.state.ispay==false){
    	this.setState({
    		ispay:true
    	})
    }else{
    	this.setState({
    		ispay:false
    	})
    }
    if (checked) {
      this.setState({
        isChecked: index
      })
    }
  }
  
  whatserve (){
  	this.props.history.push('/declaration')
  }
  
  changeAgree (e) {
    let checked = e.target.checked
    this.setState({
      isAgree: checked
    })
  }
  render() {
    return (
      <div className="lessonbuy-view">
    			<ul className="buy-box">
    					<li>
    						<span>私教课:</span>
    						<span>{this.state.lessonType==6 ? '常规课程' : '精品课程'}</span>
    					</li>
    					<li>
    						<span>地点:</span>
    						<span>转塘店</span>
    					</li>
    					<li>
    						<span>课程数:</span>
    						<div className="change-price">
    							<i className="iconfont" onClick={this.changeCountL.bind(this)}>&#xe64b;</i>
    							<span>{this.state.lessonCount}</span>
    							<i className="iconfont" onClick={this.changeCountR.bind(this)}>&#xe64d;</i>
    						</div>
    					</li>
    					<li>
    						<span>价格:</span>
    						<span className="amount-price">{this.state.amountprice}</span>
    					</li>
    					
    			</ul>
    			<div className="single-price">
    						<span>{this.state.priceStr}</span>
    		  </div>
    		  
    		  <div className="pay-can">
    		  	<h3>支付方式</h3>
    		  	<div className="ali-pay">
    		  		<em className="iconfont wxcont">&#xe634;</em>
    		  		<span>微信支付</span>
    		  		<Checkbox  onChange={this.changeCheck.bind(this, 2)} className="zhifulog"></Checkbox>
    		  	</div>
    		  	
    		  	<div className="pay-book">
    		  		<Checkbox checked={this.state.isAgree} onChange={this.changeAgree.bind(this)} className="agree-check"></Checkbox>
    		  		<span>我已阅读并同意</span>
    		  		<span onClick={this.whatserve.bind(this)}>X-COOL健身服务条款</span>
    		  	</div>
    		  </div>
    		  
    		 
    		  <div onClick={this.payNow.bind(this)} className={`pay-now ${this.state.isAgree&&this.state.ispay ? 'active' : ''}`}>
    		  	<span>立即支付</span>
    		  </div>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
