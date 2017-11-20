import React from 'react';
import { connect } from 'dva';
import { Carousel } from 'antd'
import './carsouel.less';

class Carsouel extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
    }
  }
  render() {
    let bannerImg = this.props.banner ? this.props.banner.splice(0,3): ''
    return (
      <div>
        {
          bannerImg !== '' && bannerImg !== null ? (
            <Carousel>
              {
                bannerImg.map((item, index) => {
                  return (
                    <div className="carousel" key={index}>
                      {
                          item.cover !== null && item.cover !== '' ? <img src={item.cover}/> : <img src={require('../../../../../assets/defaultCarsouel.png?x-oss-process=image/resize,h_120')}/>
                      }
                    </div>
                  )
                })
              }
            </Carousel>
          ) : ''
        }
      </div>
    )
  }
}

Carsouel.propTypes = {
};

export default connect()(Carsouel);