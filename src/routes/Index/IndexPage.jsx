import React from 'react';
import { connect } from 'dva';
import { Route, NavLink } from 'dva/router';
import Course from '../course/Course'
import Appointment from '../appointment/Appointment'
import Personal from '../personal/Personal'
import ClubCard from '../clubCard/ClubCard'
import './style.less';



class IndexPage extends React.Component {
  constructor (props) {
    super(props)
  }
  render() {
    return (
      <div className="home-view">
        <Route path="/index/course" component={Course} />
        <Route path="/index/appointment" component={Appointment} />
        <Route path="/index/personal" component={Personal} />
        <Route path="/index/clubCard" component={ClubCard} />
        <div className="footer-wrapper">
          <ul className="tab-list">
            <NavLink replace activeClassName="active" to="/index/course">
              <li className="tab-item">
                <i className="iconfont footer-icon hollow">&#xe62e;</i>
                <i className="iconfont footer-icon solid">&#xe62d;</i>
                精品团课
              </li>
            </NavLink>
            <NavLink replace activeClassName="active" to="/index/personal">
              <li className="tab-item">
                <i className="iconfont footer-icon hollow">&#xe630;</i>
                <i className="iconfont footer-icon solid">&#xe635;</i>
                私教
              </li>
            </NavLink>
            <NavLink replace activeClassName="active" to="/index/clubCard">
              <li className="tab-item">
                <i className="iconfont footer-icon hollow">&#xe62b;</i>
                <i className="iconfont footer-icon solid">&#xe633;</i>
                会员卡
              </li>
            </NavLink>
            <NavLink replace activeClassName="active" to="/index/appointment">
              <li className="tab-item">
                <i className="iconfont footer-icon hollow">&#xe636;</i>
                <i className="iconfont footer-icon solid">&#xe637;</i>
                我的预约
              </li>
            </NavLink>
          </ul>
        </div>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
