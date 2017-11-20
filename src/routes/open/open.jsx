import React from 'react';
import { connect } from 'dva';
import Bedroom from './bedroom/bedroom'
import Bathroom from './bathroom/bathroom'
import './open.less';
import QRCode from 'qrcodejs2'
import openDoorAPI from '../../services/openDoorAPI.js'
import { query } from '../../services/example.js'
import { message } from 'antd';


class Open extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: true,
      timer: null,
      loading: false,
      // 用户类别 0:非会员 1:会员 2:过期会员
      userType: 0
    }
  }

  componentWillUnmount () {
    if (this.state.timer ) {
      window.clearInterval(this.state.timer)
    }
  }

  componentDidMount () {
     function getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
      var context = "";
      if(r != null)
        context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined" ? "" : context;
    }

     query(getQueryString("code")).then(res2=>{
        openDoorAPI.getUser().then( res => {
           this.setState({
              userType: res.data.data.userType
            })
           if (res.data.data.userType === 1) {
                  this.renderQRCode()
                  // 30秒刷新一次
                  let localTimer = window.setInterval( () => {
                    this.renderQRCode()
                  }, 3000)
                  this.setState({
                    timer: localTimer
                  })
           }
        })
     })
    
    
    
  }

  renderQRCode () {
    console.log(this.state.show)
    if( this.state.show ) {
      openDoorAPI.getQRCode().then(res => {
        document.getElementById("qrcode").innerHTML = ''
          // 生成一个二维码
          new QRCode(document.getElementById("qrcode"), {
            text: res.data.data,
            width: 200,
            height: 200,
          });
      })
    } else {
      openDoorAPI.getWashroomKeyQRCode().then(res => {
        document.getElementById("qrcode").innerHTML = ''
          // 生成一个二维码
          new QRCode(document.getElementById("qrcode"), {
            text: res.data.data,
            width: 200,
            height: 200,
          });
      })
      
    }
     
  }

  //切换主门禁和浴室门禁
  change (val) {
    if (val === 'bed') {
      this.setState({
        show: true
      }, () => {
        if (this.state.userType === 1) {
          this.renderQRCode()
        }
      })
    } else {
      this.setState({
        show: false
      }, () => {
        this.renderQRCode()
      })
    }
  }
  refresh () {
    this.setState({
      loading: true
    })
    openDoorAPI.refrsh().then(res => {
      if (this.state.userType === 1) {
        this.setState({
          loading: false
        })
        this.renderQRCode()
      }
    })
  }
  render() {
    return (
      <div className="x-open">
        <div className="tab">
          <div className="tab-list">
            <span className={this.state.show ? 'main active' : 'main'} onClick={this.change.bind(this, 'bed')}>主门禁</span>
          </div>
          <div className="tab-list">
            <span className={this.state.show ? 'bathroom' : 'bathroom active'} onClick={this.change.bind(this, 'bath')}>浴室门禁</span>
          </div>
        </div>
        {
        
          this.state.show ? <Bedroom userType={this.state.userType}></Bedroom> : <Bathroom userType={this.state.userType}></Bathroom>
        }
        {
        
          this.state.show && this.state.userType===1 ?  <div className={this.state.loading ? 'refresh-loading re-new' :'re-new'} onClick={this.refresh.bind(this)}><i className="iconfont footer-icon">&#xe658;</i> &nbsp;重新生成</div> : ''
        }
       
      </div>
    );
  }
}

Open.propTypes = {
};

export default connect()(Open);
