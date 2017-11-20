import React from 'react';
import { connect } from 'dva';
import './style.less';
import { Spin } from 'antd'
import CourseCard from './CourseCard/CourseCard'
import { dateFormat } from '../../utils/dateFormat'
import courseAPI from '../../services/courseAPI.js'
import authInit from '../../utils/auth.js'
import Loading from '../../components/Loading/Loading'

class Course extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sportList: [
        {
          name: '瑜伽',
          type: 1,
          icon: '&#xe639;'
        },
        {
          name: '舞蹈',
          type: 2,
          icon: '&#xe63c;'
        },
        {
          name: '单车',
          type: 3,
          icon: '&#xe629;'
        },
        {
          name: '杠铃操',
          type: 4,
          icon: '&#xe62c;'
        },
        {
          name: '格斗',
          type: 5,
          icon: '&#xe632;'
        }
      ],
      dateList: [],
      courseList: [],
      defaultType: '',
      defaultDate: null,
      isLoading: false
    }
  }


  componentDidMount () {


    document.title = '精品团课'
    let str = '日一二三四五六'
    let today = new Date()
    let dateList = []
    console.log('*******')
    console.log(today)
    dateList.push({
      week: '今天',
      date: dateFormat(today).substr(5).replace('-', '.'),
      fullString: dateFormat(today)
    })
    dateList.push({
      week: '明天',
      date: dateFormat(today, 1).substr(5).replace('-', '.'),
      fullString: dateFormat(today, 1)
    })
    dateList.push({
      week: `周${str[new Date(dateFormat(today, 2)).getDay()]}`,
      date: dateFormat(today, 2).substr(5).replace('-', '.'),
      fullString: dateFormat(today, 2)
    })
    dateList.push({
      week: `周${str[new Date(dateFormat(today, 3)).getDay()]}`,
      date: dateFormat(today, 3).substr(5).replace('-', '.'),
      fullString: dateFormat(today, 3)
    })
    dateList.push({
      week: `周${str[new Date(dateFormat(today, 4)).getDay()]}`,
      date: dateFormat(today, 4).substr(5).replace('-', '.'),
      fullString: dateFormat(today, 4)
    })
    dateList.push({
      week: `周${str[new Date(dateFormat(today, 5)).getDay()]}`,
      date: dateFormat(today, 5).substr(5).replace('-', '.'),
      fullString: dateFormat(today, 5)
    })
    this.setState({
      dateList,
      defaultDate: dateFormat(today)
    }, () => {
      // 开始请求列表
      this.getGroupList(this.state.defaultType, dateFormat(today))
    })
  }  


  getGroupList (type, time) {
    this.setState({
      isLoading: true
    })

    authInit(window).then( res => {
      console.log('xxxaaa')
      courseAPI.getGroupList({ date: time, category: type }).then(res => {
        if (!res.data.code) {
          this.setState({
            courseList: res.data.data,
            isLoading: false
          })
        }
      })
    })
  }

  changeType (item) {
    if (item !== this.state.defaultType) {
      this.setState({
        defaultType: item
      }, () => {
        this.getGroupList(this.state.defaultType, this.state.defaultDate)
      })
    }
  }

  choiceDay (item) {
    let that = this
    if (item !== this.state.defaultDate) {
      this.setState({
        defaultDate: item
      }, () => {
        that.getGroupList(that.state.defaultType, that.state.defaultDate)
      })
    }
  }
  render() {
    return (
      <div className="course-wrapper">
        <ul className="sport-list">
          {
            this.state.sportList.map((item,index) => {
              return (
                <li onClick={this.changeType.bind(this, item.type)} className={`sport-item ${item.type === this.state.defaultType ? 'active' : ''}`} key={index}>
                  <i className="iconfont header-icon" dangerouslySetInnerHTML={{__html: item.icon}}></i>
                  {item.name}
                </li>
              )
            })
          }
        </ul>

        <ul className="date-list">
          {
            this.state.dateList.map((item, index) => {
              return (
                <li key={index} className={`date-item ${this.state.defaultDate === item.fullString ? 'active' : ''}`} onClick={this.choiceDay.bind(this, item.fullString)}>
                  <p className="week">{item.week}</p>
                  <p className="date">{item.date}</p>
                </li>
              )
            })
          }
          <li className="line"></li>
        </ul>

        {
          this.state.isLoading ?
          (
            <Loading top="15"></Loading>
          ) : (
            <div>
              {
                this.state.courseList.length > 0 ?
                (
                  <div className="card-list">
                    {
                      this.state.courseList.map((item, index) => {
                        return (
                          <CourseCard key={index} data={item}></CourseCard>
                        )
                      })
                    }
                    {
                      this.state.courseList.length > 4 &&
                      <div className="bottom-tip">已经到底了...</div>
                    }
                  </div>
                ) :
                (
                  <div className="no-data">
                    <img src={require('../../assets/nodata/nodata.png')} alt=""/>
                    <p>暂无数据</p>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    );
  }
}

Course.propTypes = {
};

export default connect()(Course);
