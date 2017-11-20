import React from 'react';
import { connect } from 'dva';
import { Route, NavLink } from 'dva/router';
import Hot from './hot/hot.jsx'
import Mine from './mine/mine.jsx'


import './style.less';



class IndexPage extends React.Component {
  constructor (props) {
    super(props)
  }
  render() {
    return (
      <div className="party-view">
        <div className="nav-top">
          {/*<div className="nav-left">热门</div>*/}
          {/*<div className="nav-right">我的</div>*/}
          <div className="nav-left">
            <NavLink replace activeClassName="focus-style" to="/indexCool/social/socialHot">
              热门
            </NavLink>
          </div>
          <div className="nav-right">
            <NavLink replace activeClassName="focus-style" to="/indexCool/social/socialMine">
              我的
            </NavLink>
          </div>


        </div>
        <div>
          <Route path="/indexCool/social/socialHot" exact component={Hot} />
          <Route path="/indexCool/social/socialMine" exact component={Mine} />
        </div>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
