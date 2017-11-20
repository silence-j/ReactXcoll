import React from 'react';
import { connect } from 'dva';
import { NavLink } from 'dva/router';
import centerAPI from '../../../services/centerAPI.js'
import { Modal, Button, Toast } from 'antd-mobile';
import { Link } from 'dva/router';
import authInit from '../../../utils/auth.js'
import { phoneReplace } from '../../../utils/phoneReplace'
import './style.less';

const prompt = Modal.prompt;
class Center extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      course: '',
      activity: '',
      tel: true,
      course: 0,
      activity: 0,
    }
  }

  componentDidMount () {
    document.title = '个人中心'
    authInit(window).then( res => {
      centerAPI.getInfo().then( res => {
        let data = res.data.data
        console.log(data)
        this.setState({
          tel: phoneReplace( data.phone ) || null,
          introduction: data.introduction,
          photo: data.avatar,
          course: data.courseCount,
          activity: data.activityCount,
          userType: data.userType,
        })
      })
    })
    const alert = Modal.alert;
    const showAlert = () => {
    const alertInstance = alert('Delete', 'Are you sure???', [
      { text: 'Cancel', onPress: () => console.log('cancel'), style: 'default' },
      { text: 'OK', onPress: () => console.log('ok') },
    ]);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      console.log('auto close');
      alertInstance.close();
    }, 500000);
  };
  
  }

  getValue(){
    prompt(
      '', 
      '用一句话介绍自己',
      [
        { text: '取消' },
        { 
          text: '提交',
          onPress: (val) => {
            
            this.submitValue(val)
          } 
        },
      ], 
      'default', this.state.introduction,
    )
  } 

  submitValue(val) {
    centerAPI.submit({introduction:val}).then( res => {
      this.setState({
        introduction: val
      })
    })
  }

  render() {
    return (
      <div className="center-container">
      { /* 如果手机号为空，则显示 */}
      {
        !this.state.tel  &&
        (<div className="binding">
          <i className="iconfont phone">&#xe64a;</i>
          <span className="bind-content">绑定手机号,防止个人资产丢失</span>
          <Link to='/linkTo?origin=bind'>
            <span className="bind-tel">绑定手机</span>
          </Link>
        </div>)
      }
        <div className="container-top">
          <img className="background" src={require('../../../assets/image/banner.png')} alt="" />
          <img className="heard" src={this.state.photo  || require('../../../assets/defaultAvtar.png') } alt="" />
          <p className="telphon">{this.state.tel}</p>
          <p className="introduce">
            <p className="prime" onClick={this.getValue.bind(this)}>{ this.state.introduction || '用一句话介绍自己' }</p>
            <i className="iconfont write" onClick={this.getValue.bind(this)} >&#xe60b;</i> 
          </p>
        </div>
        <div className="container-mid">
        <NavLink to="/hisCourse">
          <div className="history">
            <span className="total">{this.state.course}</span>
            <span className="course">历史课程</span>
          </div>
        </NavLink>
        <NavLink to="/activity">
          <div className="part">
            <span className="total">{this.state.activity}</span>
            <span className="active" >参与活动</span>
          </div>
        </NavLink>
        </div>
        <div className="container-foot">
          <ul className="list">
           {
             this.state.userType ===1 &&
             (
              <NavLink to="/myClubCard">
                <li className="item">我的会员卡<span>&gt;</span></li>
              </NavLink>
             )
           }
            <NavLink to="/expense">
              <li className="item expense">消费记录<span>&gt;</span></li>
            </NavLink>
          </ul>
        </div>
      </div>
    )
  }
}

export default connect()(Center);
