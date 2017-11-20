import React from 'react';
import { connect } from 'dva';
import { Route, NavLink } from 'dva/router';
import teacherinfo from "../../../services/teacherAPI.js"
import './style.less';
import Loading from "../../../components/Loading/Loading"



class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state={
    	isLoading:true,
    	featureList:[{
            id: 4,
            type: 1,
            count: 12,
            price: 400,
            amount: 480000,
            oriAmount:480000,
            updateTime: null,
            createTime: null,
            deleteTag: 0
        },],
        
      normalList: [{
            id: 1,
            type: 0,
            count: 12,
            price: 300,
            amount: 360000,
            oriAmount:360000,
            updateTime: null,
            createTime: null,
            deleteTag: 0
        }]
    }
  }
  
  componentDidMount (){
  	document.title="私教套餐"
  	teacherinfo.getprice().then(res =>this.setState({
  		featureList:res.data.data.featureList,
  		normalList:res.data.data.normalList,
  		isLoading:false
  	}))
  }

  goToFeature (item, list) {
    let max = list[list.length - 1].count
    this.props.history.push(`/reallesson/?count=${item.count}&type=${item.type}&amount=${item.amount}&max=${max}`)
  }
  
  

  render() {
  	 return (
  	 	<div>
  	 	{
  	 		this.state.isLoading ?
  	 		(
  	 			<Loading top="20"></Loading>
  	 		) : (
  	 		
  	 		<div className="vip-buy">
		      	<div className="title-box">
		      			<h2>精品课程</h2>
		      	</div>
		      	<ul className="money-box">
		      	 {
		      	 	this.state.featureList.map((item) =>{
                if (item.count !== 100000) {
                  return (
                    <li key={item.id} onClick={this.goToFeature.bind(this, item, this.state.featureList)}>
                      <div className="money-left">
                        <div className="left-logo">
                          <span>{item.count}</span>
                          <span>节</span>
                        </div>
                        <span>¥</span>
                        <span>{(item.amount / 100).toFixed(2)}</span>
                      </div>
                      <div className="money-right">
                        <span>{(item.price / 100).toFixed(2)}/课时</span>
                        <i className="iconfont"></i>
                      </div>
                    </li>
                  )
                }
		      	 	})
		      	 }
		      		
		      	</ul>
		      	
		      	<div className="title-box">
		      			<h2>常规课程</h2>
		      	</div>
		      	<ul className="money-box">
		      	 {
		      	 	this.state.normalList.map((item) =>{
                if (item.count !== 100000) {
                  return (
                    <li key={item.id} onClick={this.goToFeature.bind(this, item, this.state.normalList)}>
                      <div className="money-left">
                        <div className="left-logo">
                          <span>{item.count}</span>
                          <span>节</span>
                        </div>
                        <span>¥</span>
                        <span>{(item.amount / 100).toFixed(2)}</span>
                      </div>
                      <div className="money-right">
                        <span>{(item.price / 100).toFixed(2)}/课时</span>
                        <i className="iconfont"></i>
                      </div>
                    </li>
                  )
                }
		      	 	})
		      	 }
		      	</ul> 	
      </div>
  	 		)
  	 	}
     </div> 
    );
  }
}


IndexPage.propTypes = {
};

export default connect()(IndexPage);
