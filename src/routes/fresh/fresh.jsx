import React from 'react';
import { connect } from 'dva';
import './fresh.less';

class Fresh extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      videoList: [
        {
          name: '坐式下拉训练器',
          src: 'http://26272.long-vod.cdn.aodianyun.com/u/26272/mp4/0x0/9b8e423456c2bf97d7867f40a64d1d8f.mp4',
          poster: require('../../assets/image/video1.png')
        },
        {
          name: '坐姿划船器',
          src: 'http://26272.long-vod.cdn.aodianyun.com/u/26272/mp4/0x0/815c4a26f66e50b72113ff530845d880.mp4',
          poster: require('../../assets/image/video2.png')
        },
        {
          name: '坐式下斜推胸训练器',
          src: 'http://26272.long-vod.cdn.aodianyun.com/u/26272/mp4/0x0/3147100a01cd5995d070e48f23265b35.mp4',
          poster: require('../../assets/image/video3.png')
        },
        {
          name: '坐式伸腿器',
          src: 'http://26272.long-vod.cdn.aodianyun.com/u/26272/mp4/0x0/068ab918ff9cc46eb9823e4a7c8b4095.mp4',
          poster: require('../../assets/image/video4.png')
        },
        {
          name: '坐式举肩训练器',
          src: 'http://26272.long-vod.cdn.aodianyun.com/u/26272/mp4/0x0/11bdd5b65a8119502e48e76a8a8117af.mp4',
          poster: require('../../assets/image/video5.png')
        },
        {
          name: '坐式高位划船器',
          src: 'http://26272.long-vod.cdn.aodianyun.com/u/26272/mp4/0x0/fa1e7c5a03d4192dd107c93f298c86d6.mp4',
          poster: require('../../assets/image/video6.png')
        },
        {
          name: '仰卧推肩训练器',
          src: 'http://26272.long-vod.cdn.aodianyun.com/u/26272/mp4/0x0/dc23839c8867b0020ead3fa0753a5872.mp4',
          poster: require('../../assets/image/video7.png')
        },
        {
          name: '卧姿勾腿器',
          src: 'http://26272.long-vod.cdn.aodianyun.com/u/26272/mp4/0x0/282914489dd9ad9ffe212ed988c754b2.mp4',
          poster: require('../../assets/image/video8.png')
        },
        {
          name: '反飞鸟训练器',
          src: 'http://26272.long-vod.cdn.aodianyun.com/u/26272/mp4/0x0/1ec8b17b2aa706c4e97d6b8449e74e3b.mp4',
          poster: require('../../assets/image/video9.png')
        }
      ],
      currentIndex: 0,
      showVideoMask: false
    }
  }
  componentDidMount () {
    document.title = '新手指南'
  }
  playVedio(index) {
    this.setState({
      currentIndex: index,
      showVideoMask: true
    }, () => {
      this.video.play()
    })
  }
  hideVideoMask(e) {
    if (e.target.className !== 'video') {
      this.video.pause()
      this.setState({
        showVideoMask: false
      })
    }
  }
  render() {
    return (
      <div className="f-container">
        <div className="vcr">
          <div className="vcr-container">
            <p className="name">器械教学</p>
            <ul className="ul-container">
              {
                this.state.videoList.map((item, index) => {
                  return <li key={item.name}>
                    <div onClick={this.playVedio.bind(this, index)} className="play-icon">
                      <img src={require('../../assets/image/play.png')} alt=""/>
                    </div>
                    <img className="img" src={item.poster} alt=""/>
                    <p>{item.name}</p>
                  </li>
                })
              }
            </ul>
          </div>
        </div>

        {
          this.state.showVideoMask &&
          (
            <div className="video-mask" onClick={this.hideVideoMask.bind(this)}>
              <video
                ref={(video) => this.video = video} 
                className="video">
                <source src={this.state.videoList[this.state.currentIndex].src} type="video/mp4" />
              </video>
            </div>
          )
        }
      </div>
    );
  }
}

Fresh.propTypes = {
};

export default connect()(Fresh);
