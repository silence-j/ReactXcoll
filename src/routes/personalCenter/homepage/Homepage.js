import React from 'react';
import { connect } from 'dva';
import { Route, NavLink } from 'dva/router';
import Center from '../center/Center'
import Expense from '../expense/Expense'
import Sport from '../../sportAd/sportsAd'
import { query } from '../../../services/example.js'
import './style.css';

class Homepage extends React.Component {

  componentDidMount (){
    
  }

  render() {
    return (
      <div className="center-home">
        <Route path="/homepage/center" component={Center} />
        <Route path="/homepage/expense" component={Expense} />
        <Route path="/homepage/Sport" component={Sport} />
        <div className="footer-wrapper">
          <ul className="tab-list">
            <li className="tab-item">
              <NavLink replace activeClassName="active" to="/homepage/center">
                <i className="iconfont hollow">&#xe659;</i>
                <i className="iconfont solid">&#xe61c;</i>
                个人中心
              </NavLink>
            </li>
            <li className="tab-item">
              <NavLink replace activeClassName="active" to="/homepage/expense">
                <i className="iconfont hollow">&#xe655;</i>
                <i className="iconfont solid">&#xe656;</i>
                消费记录
              </NavLink>
            </li>
            <li className="tab-item">
              <NavLink replace activeClassName="active" to="/homepage/Sport">
                <i className="iconfont hollow">&#xe61b;</i>
                <i className="iconfont solid">&#xe620;</i>
                运动建议
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Homepage.propTypes = {
};

export default connect()(Homepage);
