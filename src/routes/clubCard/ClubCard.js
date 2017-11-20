import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router'
import clubCardAPI from '../../services/clubCardAPI'
import { fenToYuan } from '../../utils/dateFormat'
import authInit from '../../utils/auth.js'
import './style.less';


class ClubCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tit: '会员套餐',
      coolYearCard: '',
      type: [],
      pic: '',
    }
  }

  // 筛选time为1的卡
   componentDidMount() {
      document.title = '会员卡'

      authInit(window).then( res => {
        clubCardAPI.getCard().then( res => {
          let arr = []
          let pic
          let background
          let data = res.data.data
          for ( let index in data) {
            let item = data[index]
            for ( let index in item ) {
              if ( item[index].id == 1 ) {
                pic = require('../../assets/image/card1.png')
                background = 'linear-gradient(-132deg, #B7B7B7 0%, #9E9E9E 100%)'
              } else if ( item[index].id == 4 ) {
                pic = require('../../assets/image/card2.png')
                background = 'linear-gradient(-132deg, #FFD365 0%, #FCCB51 100%)'
              } else if ( item[index].id == 7 ) {
                pic = require('../../assets/image/card3.png')
                background = 'linear-gradient(-132deg, #52D3E7 0%, #45C8DC 100%)'
              } else if ( item[index].id == 10 ) {
                pic = require('../../assets/image/card4.png')
                background = ' linear-gradient(-132deg, #FF7E7B 0%, #FF6763 100%)'
              }
              if (item[index].time === 1 ) {
                arr.push({ id: item[index].id, name: item[index].name, price: item[index].price, oriPrice: item[index].oriPrice, type: item[index].type, pic: pic, background: background })
              } 
            }
          }
          this.setState({
            type: arr
          })
        })
      })
   }

   saveyear(item) {
     localStorage.name = item.name
     localStorage.id = item.id
     localStorage.pic = item.pic
     localStorage.background = item.background
   }

  render() {
    return (
      <div className="clubCard-container">
          <ul className="card-list"> {
            this.state.type.map((item, index) => {
              return (
                <Link to={`/cardDetail?type=${item.type}`} key={index}>
                  <li className="card-item" onClick={this.saveyear.bind(this,item)} >
                    <div className="info-item" style={{background:`${item.background}` }} >
                      <h2>{item.name}(年卡)</h2>
                      <p className="cool-me">酷炼酷真我</p>
                      <div className="card-price">
                        <span className="new-price"><i>￥</i>{fenToYuan(item.price)}</span>
                        <span className="old-price">
                          ￥{fenToYuan(item.oriPrice)}
                          <em className="line"></em>
                        </span>
                      </div>
                      <img src={item.pic} alt=""/>
                    </div>
                  </li>
                  <div className="line-20"></div>
                  <div className="line-60"></div>
                </Link>
              )
            })
          }
          </ul>
      </div>
    )
  }
}

export default connect()(ClubCard);
