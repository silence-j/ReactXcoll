import React from 'react';
import { connect } from 'dva';
import myClubCard from '../../../../services/myClubCardAPI.js'
import enCode from '../../../../utils/enCode'
import { turnYMD } from '../../../../utils/dateFormat'
import { phoneReplace } from '../../../../utils/phoneReplace'
import './style.less';

class MyClubCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      relationdata: {},
      cardPic:'',
      comment: '',
      cardName: '',
      cardType: '',
      pic: '',
      relationPic: '',
      nick: '',
      relationNick: '',
      phone: '',
      relationPhone: '',
      startTime: '',
      endTime: ''
    }
  }

  componentDidMount() {
    document.title = '我的会员卡'
    myClubCard.getCard().then( res => {
      let data = res.data.data
      let user = data.user
      let relationUser = data.relationUser || {}
      console.log(data)
      let cardName
      let cardPic
      if ( data.cardType === 0 ) {
        cardName = '个人基础卡'
        cardPic = require('../../../../assets/image/card1.png')
      } else if ( data.cardType === 1 ) {
        cardName = '个人组合卡'
        cardPic = require('../../../../assets/image/card2.png')
      } else if ( data.cardType === 2 ) {
        cardName = '情侣基础卡'
        cardPic = require('../../../../assets/image/card3.png')
      } else if ( data.cardType === 3 ) {
        cardName = '情侣组合卡'
        cardPic = require('../../../../assets/image/card4.png')
      } 
      this.setState({
        comment: data.comment,
        cardName: cardName,
        cardType: data.cardType,
        pic: user.avatar,
        relationPic: relationUser.avatar || null,
        nick: user.nickName,
        relationNick: relationUser.nickName || null,
        phone: phoneReplace( user.phone ),
        relationPhone: phoneReplace( relationUser.phone ) || null,
        startTime: data.startTime,
        endTime: data.endTime,
        cardPic: cardPic,
      })
    })
  }

  render() {
    return (
      <div className="container">
        <div className="top-pic" style={{background:`${localStorage.background}`}}>
          <img className="card-type" src={require('../../../../assets/image/personalCard.png')} alt="" />
          <div className="card-info">
            <p className="title">{this.state.cardName}</p>
            <div className="useful-date">
              <span className="useful-content">有效期:</span>
              <span className="useful-date">{turnYMD(this.state.startTime)}~{turnYMD(this.state.endTime)}</span>
            </div>
          </div>
          <img className="card-item" src={localStorage.pic} alt=""/>
        </div>
        {
          (this.state.cardType == 2 || this.state.cardType == 3) &&
          (<div className="lovers">
            <h2><i className="iconfont">&#xe65e;</i>会员信息</h2>
            <div className="lovers-info">
              <div className="lovers-content">
                <p><span className="main-card">主卡：</span><span>{this.state.nick}</span>{this.state.phone}</p>
                <p><span className="main-card">副卡：</span><span>{this.state.relationNick}</span>{this.state.relationPhone}</p>
              </div>
            </div>
          </div>)
        }
        
        <div className="sever">
          <h2><i className="iconfont print">&#xe64e;</i>会员服务</h2>
          <div dangerouslySetInnerHTML={{__html: enCode(this.state.comment)}} />
        </div>
      </div>
    )
  }
}

export default connect()(MyClubCard);
