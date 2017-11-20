import React from 'react';
import { connect } from 'dva';
import './login.less';
import { Button } from 'antd'
import { Input } from 'antd'
import { Toast } from 'antd-mobile'
import loginAPI from '../../services/loginAPI'
import qs from 'query-string'

class Detail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isPhone: false,
      isCode: false,
      error: false,
      phone:'',
      code: '',
    //  接口返回code
      msgCode: '1234'
    }
  }
  componentDidMount () {
    document.title = '立即绑定'
  }
  //验证输入信息
  isRight () {
    this.setState({
      error: false
    })
  }
  orRight () {
    let reg = /^1[0-9]{10}$/
    if (reg.test(this.state.phone) !== true) {
      this.setState({
        isPhone: false,
        error: true
      })
    } else {
      this.setState({
        isPhone: true,
        error: false
      })
    }
  }
  changePhone (val, e) {
    if (val === 'phone') {
      this.setState({
        phone: e.target.value
      })
    } else {
      this.setState({
        code: e.target.value
      })
    }

  }
  //获取验证码
  getCode () {
    if (this.state.isPhone === false) {
      Toast.fail('请输入正确的手机号', 1);
    } else {
      loginAPI.getCode({mobile: this.state.phone, type: 1}).then(res => {
        if(!res.data.code) {
          Toast.success('发送成功', 1);
          // alert('发送成功')
        }
      })
    }
  }
  //立即绑定
  doBind () {
    const id = qs.parse(this.props.location.search).id
    const type = qs.parse(this.props.location.search).type
    const virtualBalance = qs.parse(this.props.location.search).virtualBalance
    // if (qs.parse(this.props.location.search).which === 'active') {
    //   id = qs.parse(this.props.location.search).id
    //
    // }
    if (this.state.phone === '' && this.state.code === '') {
      Toast.fail('请输入手机号或验证码', 1)
    } else {
      if (this.state.isPhone !== true || this.state.code === '') {
        Toast.fail('手机号或验证码错误', 1)
      } else {
        loginAPI.doBind({mobile: this.state.phone, code: this.state.code}).then((res) => {
          if(!res.data.code) {
            Toast.success('绑定成功', 1, () => {
              if(qs.parse(this.props.location.search).which === 'course') {
                this.props.history.push({
                  pathname: '/payment',
                  search: `?which=course&id=${id}&type=${type}&virtualBalance=${virtualBalance}`
                })
              } else if (qs.parse(this.props.location.search).which === 'active') {
                this.props.history.push({
                  pathname: '/payment',
                  search: `?which=active&id=${id}&type=${type}&virtualBalance=${virtualBalance}`
                })
              }
            });
          } else {
            alert(res.data.message)
          }
        })
      }
    }
  }
  //取消绑定
  cancelBind () {
    this.props.history.goBack(1)
  }
  render() {
    return (
      <div className="L-container">
        <img className="solgn" src={require('../../assets/solgn.png')} alt=""/>
        <div className="login-type">
          {this.state.error ? <p className="error"><em></em>请输入正确的手机号码</p> : <p className="error"></p>}

          <Input className={`${this.state.error ? 'errorBg' : 'phone'} `} placeholder="请输入手机号码" value={this.state.phone} onChange={this.changePhone.bind(this, 'phone')}  onFocus={this.isRight.bind(this)} onBlur={this.orRight.bind(this, 'code')}/>

          <div>
            <Input className="code" placeholder="请输入验证码" value={this.state.code} onChange={this.changePhone.bind(this, 'code')} onBlur={this.isRight.bind(this, 'code')}/>
            <Button className='getCode' onClick={this.getCode.bind(this, 'code')}>获取验证码</Button>
          </div>

          <div className="operation">
            <Button className={`${this.state.isCode === true && this.state.isPhone === true ? 'addIt avaible' : 'addIt'}`} onClick={this.doBind.bind(this)}>立即绑定</Button>
            <Button className='cancel' onClick={this.cancelBind.bind(this)}>取消绑定</Button>
          </div>

        </div>
      </div>
    )
  }
}

Detail.propTypes = {
};

export default connect()(Detail);
