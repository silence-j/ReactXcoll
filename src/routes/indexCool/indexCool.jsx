import React from 'react';
import { connect } from 'dva';
import { Route, NavLink } from 'dva/router';
// import Open from '../open/open'
import SportAd from '../sportAd/sportsAd'
import Fresh from '../fresh/fresh'
import AboutUs from '../aboutUs/aboutUs'
import SocialHot from '../social/show/show'
import socialMine from '../social/party/active/active'
import './indexCool.less';



class IndexCool extends React.Component {
  constructor (props) {
    super(props)
  }
  render() {
    return (
      <div className="cool-view">
        {/*<Route path="/indexCool/open" component={Open} />*/}
        <Route path="/indexCool/sportAd" component={SportAd} />
        <Route path="/indexCool/Fresh" component={Fresh} />
        <Route path="/indexCool/aboutUs" component={AboutUs} />
        <Route path="/indexCool/social" component={SocialHot} />
        <Route path="/indexCool/socialMine" component={socialMine} />
        <div className="footer-wrapper">
          <ul className="tab-list">
            {/*<NavLink replace activeClassName="active" to="/indexCool/open">*/}
              {/*<li className="tab-item">*/}
                {/*<i className="iconfont footer-icon">&#xe60e;</i>*/}
                {/*开门*/}
              {/*</li>*/}
            {/*</NavLink>*/}
            <NavLink replace activeClassName="active" to="/indexCool/social/socialHot">
              <li className="tab-item">
                <i className="iconfont footer-icon hollow">&#xe623;</i>
                <i className="iconfont footer-icon solid">&#xe624;</i>
                酷社区
              </li>
            </NavLink>
            <NavLink replace activeClassName="active" to="/indexCool/socialMine">
              <li className="tab-item">
                <i className="iconfont footer-icon hollow">&#xe622;</i>
                <i className="iconfont footer-icon solid">&#xe621;</i>
                活动
              </li>
            </NavLink>
            <NavLink replace activeClassName="active" to="/indexCool/Fresh">
              <li className="tab-item">
                <i className="iconfont footer-icon hollow">&#xe616;</i>
                <i className="iconfont footer-icon solid">&#xe617;</i>
                新手指南
              </li>
            </NavLink>
            <NavLink replace activeClassName="active" to="/indexCool/aboutUs">
              <li className="tab-item">
                <i className="iconfont footer-icon hollow">&#xe611;</i>
                <i className="iconfont footer-icon solid">&#xe60c;</i>
                关于我们
              </li>
            </NavLink>
          </ul>
        </div>
      </div>
    );
  }
}

IndexCool.propTypes = {
};

export default connect()(IndexCool);



