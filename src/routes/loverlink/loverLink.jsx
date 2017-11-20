import React from 'react';
import { connect } from 'dva';
import './login.less';
import { Button } from 'antd'
import { Input } from 'antd'
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

  componentDidMount() {
    document.title = '情侣卡绑定'
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
        isPhone: false,
        error: true
      })
    } else {
      console.log(4)
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
      console.log(this.state.phone)
    } else {
      this.setState({
        code: e.target.value
      })
    }

  }
  //获取验证码
  getCode () {
    if (this.state.isPhone === false) {
      alert('请输入正确手机号')
    } else {
      loginAPI.getCode({mobile: this.state.phone, type: 1}).then(res => {
        if(!res.data.code) {
          alert('发送成功')
        }
      })
    }
  }
  //立即绑定
  doBind () {
    const id = qs.parse
    if (this.state.phone === '' && this.state.code === '') {
      alert('请输入手机号或验证码')
    } else {
      if (this.state.isPhone !== true || this.state.code === '') {
        alert('手机号或验证码错误')
      } else {
        loginAPI.doBind({mobile: this.state.phone, code: this.state.code}).then((res) => {
          if(!res.data.code) {
            alert('绑定成功')
            this.props.history.push('/anotherLover')
            search: `?id=${qs.parse(this.props.location.search).id}&type=${qs.parse(this.props.location.search).type}`
          } else {
            alert(res.data.message)
          }
        })
      }
    }
  }
  render() {
    return (
      <div className="L-container">
        <img className="solgn" src={require('../../assets/solgn.png')} alt=""/>
        <div className="login-type">
          {this.state.error ? <p className="error"><em></em>请输入正确的手机号码</p> : <p className="error"></p>}

          <Input className={`${this.state.error ? 'errorBg' : 'phone'} `} placeholder="请输入手机号码" value={this.state.phone} onChange={this.changePhone.bind(this, 'phone')}  onFocus={this.isRight.bind(this)} onBlur={this.orRight.bind(this, 'code')}/>

          <div>
            <Input className="code"placeholder="请输入验证码" value={this.state.code} onChange={this.changePhone.bind(this, 'code')} onBlur={this.isRight.bind(this, 'code')}/>
            <Button className='getCode' onClick={this.getCode.bind(this, 'code')}>获取验证码</Button>
          </div>

          <div className="operation">
            <Button className={`${this.state.isCode === true && this.state.isPhone === true ? 'addIt avaible' : 'addIt'}`} onClick={this.doBind.bind(this)}>下一步</Button>
          </div>

        </div>
      </div>
    )
  }
}
Detail.propTypes = {
};

export default connect()(Detail);
