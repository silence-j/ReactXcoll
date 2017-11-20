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
    let bannerImg = this.props.banner
    return (
      <div>
        {
          bannerImg !== null && bannerImg !== '' && bannerImg.length !== 0 ? (
            <div>
              {
                bannerImg.length === 1 ? (
                  <div className="carousel">
                    <img src={bannerImg} alt=""/>
                  </div>
                ) : (
                  <Carousel>
                    {
                      bannerImg.map((item, index) => {
                        return (
                          <div className="carousel" key={index}>
                            <img src={item} alt=""/>
                          </div>
                        )
                      })
                    }
                  </Carousel>
                )
              }
            </div>

          ) : (
            <div className="carousel">
              <img src={require('../../../../assets/defaultCarsouel.png')} alt=""/>
            </div>
          )
        }
      </div>
    )
  }
}

Carsouel.propTypes = {
};

export default connect()(Carsouel);