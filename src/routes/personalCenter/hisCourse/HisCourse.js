import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import hisCourseAPI from '../../../services/hisCourseAPI.js'
import Loading from '../../../components/Loading/Loading.jsx'
import { allTurnTime } from '../../../utils/dateFormat'
import './style.less';

class HisCourse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courseList: [
        { name: '精品团课', type: 0 },
        { name: '私教课', type: 1 },
      ],
      info: [],
      defualtType: 0,
      isLoading: false,
    }
  }

  toggle(item) {
    if (item.type !== this.state.courseList.type) {
      this.setState({
        defualtType: item.type,
      })
    }
    hisCourseAPI.getCourse({page:1, size:100, courseType: item.type}).then( res => {
      let data = res.data.data.records
      let arr = []
      let comment
      let kind = ''
      let classname
      for ( let index in data) {
        if ( data[index].status === 2 ) {
          comment = data[index].evalState === 0 ? '未评价' : '已评价'
        } else if (data[index].status === 3 ) {
            comment= '已取消'
            data[index].classname = 'self-cancel'
        } else if( data[index].status === 4 ) {
          comment= '已取消'
          data[index].classname = 'opration-cancel'
        } else if( data[index].status === 0 ) {
            comment= '排队'
        } else if ( data[index].status === 1 ) {
          comment = '预约成功'
        }
        if( data[index].category === 1 ) {
          kind = '瑜伽'
        } else if ( data[index].category === 2 ) {
          kind = '舞蹈'
        } else if ( data[index].category === 3 )  {
          kind = '单车'
        } else if ( data[index].category === 4 )  {
          kind = '杠铃'
        }  else if ( data[index].category === 5 )  {
          kind = '格斗'
        }  else if ( data[index].category === 6 )  {
          kind = '常规课程'
        }  else if ( data[index].category === 7 )  {
          kind = '精品课程'
        }
        arr.push({
          tit: data[index].courseName,
          name: data[index].coachName,
          date: [data[index].startTime, data[index].endTime],
          address: data[index].address,
          photo: data[index].coverPic,
          comment: comment,
          id: data[index].id,
          kind: kind,
          scheduleId: data[index].scheduleId,
          coachId: data[index].coachId,
          classname: data[index].classname
        })
      }
      console.log(this.state.defualtType)
      this.setState({
        info: arr
      })
    })
  }

  componentDidMount() {
    document.title = '历史课程'
    this.setState({
      isLoading: true
    })
    hisCourseAPI.getCourse({page:1, size:100, courseType: this.state.defualtType}).then( res => {
      let data = res.data.data.records
      let arr = []
      let comment
      let kind = ''
      let classname
      for ( let index in data) {
        if ( data[index].status === 2 ) {
          comment = data[index].evalState === 0 ? '未评价' : '已评价'
        } else if (data[index].status === 3 ) {
            comment= '已取消'
            data[index].classname = 'self-cancel'
        } else if( data[index].status === 4 ) {
            comment= '已取消'
            data[index].classname = 'opration-cancel'
        } else if( data[index].status === 0 ) {
            comment= '排队'
        } else if ( data[index].status === 1 ) {
            comment = '预约成功'
        }
        if( data[index].category === 1 ) {
          kind = '瑜伽'
        } else if ( data[index].category === 2 ) {
          kind = '舞蹈'
        } else if ( data[index].category === 3 )  {
          kind = '单车'
        } else if ( data[index].category === 4 )  {
          kind = '杠铃'
        }  else if ( data[index].category === 5 )  {
          kind = '格斗'
        }  else if ( data[index].category === 6 )  {
          kind = '常规课程'
        }  else if ( data[index].category === 7 )  {
          kind = '精品课程'
        }
        arr.push({
          tit: data[index].courseName,
          name: data[index].coachName,
          date: [data[index].startTime, data[index].endTime],
          address: data[index].address,
          photo: data[index].coverPic,
          comment: comment,
          id: data[index].id,
          kind: kind,
          scheduleId: data[index].scheduleId,
          coachId: data[index].coachId,
          classname: data[index].classname,
        })
      }
      console.log(this.state.defualtType)
      this.setState({
        info: arr,
        isLoading: false,
      })
    })
  }
  

trend(item) {
    if( item.comment === "未评价" ){
       this.props.history.push(`/history?type=${this.state.defualtType}&id=${item.id}`)
    } else if ( item.comment === "已评价" && this.state.defualtType == 0) {
      this.props.history.push(`/courseDetail?id=${item.scheduleId}`)
    } else if( item.comment === "已评价" && this.state.defualtType == 1 ) {
      this.props.history.push(`teacher/?id=${item.coachId}`)
    }
  }


  render() {
    return (
      <div className="appoint">
        <div className="tit">
          <ul className="tab-list"> {
                this.state.courseList.map((item,index) => {
                  return <li key={index} className={`tab-item ${item.type === this.state.defualtType ? 'active' : ''}`} onClick={this.toggle.bind(this, item)}>{item.name}</li>
                })
                }
          </ul>
        </div>
        {
          this.state.isLoading ?
          <Loading top={20}></Loading> :
          <div>
            {
              this.state.info.length === 0 ?
              (
              <div className="noda">
                <img src={require('../../../assets/nodata/nodata.png')} alt=""/>
                <p>暂无数据</p>
              </div>
              ) : (
              <ul className="pic-list">
                {
                  this.state.info.map((item,index) => {
                    return (
                        <li className="pic-item" key={index} onClick={this.trend.bind(this,item)} >
                          <img src={item.photo ? `${item.photo}?x-oss-process=image/resize,h_100` : require('../../../assets/defaultCarsouel.png')} alt="" />
                          <div className="intro">
                            <p>{item.kind}·{item.name}</p>
                            <span>{allTurnTime(+item.date[0])} ~ {allTurnTime(+item.date[1])}</span>
                          </div>
                          <div className={`status ${item.classname}`}><p>{item.comment}</p></div>
                        </li>
                    )
                  })
                }
              </ul>
              )
            }
          </div>
        }
      </div>
    );
  }
}

export default connect()(HisCourse);
