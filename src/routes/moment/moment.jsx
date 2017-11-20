import React from 'react';
import { connect } from 'dva';
// 直接引入less文件
import './moment.less';
import { Button } from 'antd'
import { Input } from 'antd'

class Detail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isPhone: true,
      isCode: false,
      error: false,
      phone:''
    }
  }
  //验证输入信息
  isRight () {
    this.setState({
      error: false
    })
    console.log('*************')
  }
  orRight () {
    console.log(this.state.phone)
    let reg = /^1[0-9]{10}$/
    if (reg.test(this.state.phone) !== true) {
      console.log(3)
      this.setState({
        error: true
      })
    } else {
      console.log(4)
      this.setState({
        error: false
      })
    }
  }
  changePhone (e) {
    this.setState({
      phone: e.target.value
    })
  }
  render() {
    return (
      <div className="L-container">
        <div className="D-title">
          <span className="reback"><em>&lt;</em> 返回</span>
          <span className="league">立即绑定</span>
          <span className="setting">
            <em className="small-cir"></em>
            <em className="small-cir"></em>
            <em className="small-cir"></em>
          </span>
        </div>
        <img className="solgn" src={require('../../assets/solgn.png')} alt=""/>
        <div className="login-type">
          {this.state.error ? <p className="error" show={this.state.error}><em></em>请输入正确的手机号码</p> : <p className="error"></p>}
          <Input className={`${this.state.error ? 'errorBg' : 'phone'} `} placeholder="请输入手机号码" value={this.state.phone} onChange={this.changePhone.bind(this)}  onFocus={this.isRight.bind(this)} onBlur={this.orRight.bind(this)}/>
          <div>
            <Input id="code"placeholder="请输入验证码"/>
            <Button className='getCode'>获取验证码</Button>
          </div>
          <div className="operation">
            <Button className='immediately'>立即绑定</Button>
            <Button className='cancel'>取消绑定</Button>
          </div>

        </div>
      </div>
    )
  }
}

Detail.propTypes = {
};

export default connect()(Detail);
