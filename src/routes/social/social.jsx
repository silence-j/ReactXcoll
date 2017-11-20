import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { NavLink } from 'dva/router'
import Show from "./show/show.jsx"
import Party from "./party/active/active.jsx"
import './style.less';
import { query } from '../../services/example.js'



class IndexPage extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    document.title = '酷社区'
  }
  render() {
    return (
      <div className="nav-bottom">
      		<Route path="/social/show" component={Show} />
      		<Route path="/social/party" component={Party} />
        	{/*<div className="foot-nav">*/}
        		{/*<div>*/}
        		{/*<NavLink replace activeClassName="active" to="/social/show/hot">*/}
        			{/*<div className="pic-nav">*/}
        				{/*<i className="iconfont pic">&#xe623;</i>*/}
        				{/*<span>个人秀</span>*/}
        			{/*</div>*/}
        			{/*</NavLink>*/}
        		{/*</div>       	        		*/}
        		{/*<div>*/}
        		{/*<NavLink replace activeClassName="active" to="/social/party">*/}
        			{/*<div className="pic-nav">*/}
        				{/*<i className="iconfont pic">&#xe622;</i>*/}
        				{/*<span>活动</span>*/}
        			{/*</div>*/}
        		{/*</NavLink>*/}
        		{/*</div>       		*/}
        	{/*</div>*/}
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
