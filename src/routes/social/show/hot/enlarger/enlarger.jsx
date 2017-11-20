import React from 'react';
import { connect } from 'dva';
import { Carousel } from 'antd'
import './enlarger.less';

class Carsouel extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
    }
  }
  close (e) {
    e.nativeEvent.stopImmediatePropagation()
    this.props.largerTo()
  }
  render() {
    let bannerImg = this.props.image
    // let bannersource =  this.props.source
    return (
      <div>
        {
          <div className="carousel-container" onClick={this.close.bind(this)}>
            <Carousel dots={this.props.dot} className="carousel">
              {
                bannerImg.map((item,index) => {
                  return (
                    <div className="carousel-enlarger" key={index}>
                      <div className="img-box" style={{backgroundImage: `url(${item})`}}></div>
                    </div>
                  )
                })
              }
            </Carousel>
          </div>
        }
      </div>
    )
  }
}

Carsouel.propTypes = {
};

export default connect()(Carsouel);