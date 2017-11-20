import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd'
import './aboutUs.less';
import Lunbopic from '../social/show/hot/enlarger/enlarger.jsx'

class AboutUs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      storeImg: [
      	require('../../assets/aboutus/one.jpg'),
      	require('../../assets/aboutus/two.jpg'),
      	require('../../assets/aboutus/three.jpg'),
      	require('../../assets/aboutus/four.jpg'),
      	require('../../assets/aboutus/five.jpg'),
      	require('../../assets/aboutus/six.jpg')
      ],
      islunbo:false
    }
  }
  changelunbo(index){  	
  	let piclist=this.state.storeImg
  	let target=piclist[index]
  	piclist.splice(index,1)
  	piclist.unshift(target)
  	console.log(piclist)
  	this.setState({
  		islunbo:true,
  		storeImg:piclist
  	})
  }
  beLarger(){
  	let storeImg= [
      	require('../../assets/aboutus/one.jpg'),
      	require('../../assets/aboutus/two.jpg'),
      	require('../../assets/aboutus/three.jpg'),
      	require('../../assets/aboutus/four.jpg'),
      	require('../../assets/aboutus/five.jpg'),
      	require('../../assets/aboutus/six.jpg')
      ]
  	this.setState({
  		islunbo:false,
  		storeImg:storeImg
  		
  		
  	})
  }
  componentDidMount () {
    document.title = '关于我们'
  }
  render() {
    return (
      <div className="a-container">
        <div className="img-contianer">
          <img src={require('../../assets/xcool/aboutus.png')} alt=""/>
        </div>
        <div className="info-us">
          <img className="x-cool" src={require('../../assets/image/xcool.png')} alt=""/>
          <p className="address">
            <i className='iconfont pic'>&#xe60f;</i> 杭州市西湖区开心路180号
          </p>
          <p className="time">
            <i className='iconfont pic'>&#xe610;</i> 8:00am ~ 22:00pm
          </p>
          <p className="phone">
            <i className='iconfont pic'>&#xe612;</i> 0557-944545454
          </p>

        </div>
        <div className="store">
          <p className="store-show">门店展示</p>
          <ul className='wrapic'>
            {
              this.state.storeImg.map((item,index) => {
                return <li key={index} onClick={this.changelunbo.bind(this,index)}><img className="store-img" src={item} alt=""/></li>
              })
            }
          </ul>
        </div>
        {this.state.islunbo ? (<Lunbopic image={this.state.storeImg} largerTo={this.beLarger.bind(this)}></Lunbopic>) : ''}
      </div>
    );
  }
}

AboutUs.propTypes = {
};

export default connect()(AboutUs);
