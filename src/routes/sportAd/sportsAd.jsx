import React from 'react';
import { connect } from 'dva';
import League from './league/league'
import PrivateCourse from './privateCourse/privateCourse'
import personalAPI from '../../services/personalAPI.js'
import Loading from '../../components/Loading/Loading'
import authInit from '../../utils/auth.js'
import './sportsAd.less';

class SportAd extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sportSuggest: '',
      isLoading: false,
      courseList: [],
      personList: [],
      isData: true

    }
  }
  componentDidMount () {
    document.title = '运动建议'
    authInit(window).then( res => {
      this.setState({
        isLoading: false,
        isData: true
      })
      personalAPI.getSportAd().then(res => {
        let cArr = [];
        let pArr = [];
        if(!res.data.code) {
          if (res.data.data.courseList !== null && res.data.data.suggestContents !== null && res.data.data.courseList.length !== 0) {
            res.data.data.courseList.forEach(res =>{
              if(res.scheduleType === 0) {
                cArr.push(res)
              } else {
                pArr.push(res)
              }
            })
            this.setState({
              isLoading: true,
              sportSuggest: res.data.data.suggestContents,
              courseList: cArr,
              personList: pArr
            })
          } else {
            this.setState({
              isLoading: true,
              isData: false
            })
          }

        }
      })
    } )
  }
  render() {
    return (
      <div className='container-sports'>
        {
          this.state.isLoading ? (
            <div>
              {
                this.state.isData ? (
                  <div className="s-container">
                    <div className="tips">
                      <p className="tipsWords"><i className="iconfont nurse">&#xe613;</i>运动小贴士</p>
                      <div className="words">
                        亲爱的
                        <span className="nick-name">{JSON.parse(localStorage.user).nickName} ，</span>
                        通过对您的运动及身体数据分析可知，您需要
                        {this.state.sportSuggest}
                      </div>
                    </div>
                    <League courseList={this.state.courseList}></League>
                    <PrivateCourse personList={this.state.personList}></PrivateCourse>
                  </div>
                ) : (
                  <div className="no-records">
                    <img src={require('../../assets/nodata/nodata.png?x-oss-process=image/resize,h_48')} alt=""/>
                    <p>暂时还没有记录哦</p>
                  </div>
                )
              }
            </div>
          ) : <Loading top="15"></Loading>
        }
      </div>
    );
  }
}

SportAd.propTypes = {
};

export default connect()(SportAd);
