import React from 'react';
import { connect } from 'dva';
import './bedroom.less';
import { NavLink } from 'dva/router';


class Bedroom extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      member: false,
      showTip: true
    }
  }
  closeTip () {
    this.setState({
      showTip: false
    })
  }
  render() {
    let userType = this.props.userType
    return (
      <div className="bedroom">
        {
          this.state.member ? 
             <div className="open">
              <img src={require('../../../assets/xcool/erweima.png')} alt=""/>
             </div> 
          : 
          (
            userType === 1 ? 
                  <div>
                  {
                    this.state.showTip ? 
                    <div className="error-tip">
                      <i className="iconfont footer-icon">&#xe65a;</i> &nbsp;扫码失败时，请点击重新生成二维码。3次/天
                       <i className="iconfont lx-close" onClick={this.closeTip.bind(this)}>&#xe647;</i>
                    </div> : ''
                  }
                     <div className="qrcode-wraper">
                      <div id="qrcode"></div>
                    </div>
                  </div>  
              : 
              <div className="not-member">
                <div className="show">
                  <a href="#/index/appointment">点击出示</a><span className="course-name"> 预约成功页</span><em>&gt;</em>
                </div>
               
                <div className="warning">
                  <img className="warn-img" src={require('../../../assets/xcool/warn.png')} alt=""/>
                  <p className="forbid">主门禁暂时未对非会员开放!</p>
                  <NavLink to='/index/clubCard'>
                    <p className="being">成为X-COOL会员</p>
                  </NavLink>
                  <p className="enjoy">享受更多优惠服务</p>
                </div>           
              </div> 
          )
         
        }
      </div>
    );
  }
}

Bedroom.propTypes = {
};

export default connect()(Bedroom);
