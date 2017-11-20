import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import appointmentAPI from '../../services/appointmentAPI'
import cancelAPI from '../../services/cancelAPI.js'
import { Modal, Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile'
import Loading from '../../components/Loading/Loading.jsx'
import { allTurnTime } from '../../utils/dateFormat'
import Alert from '../../utils/alert'
import './style.less';
import authInit from '../../utils/auth.js'

function AlertMessage() {
  return (
    <div className="message">
      <p>亲确认取消此次预约么?</p>
      <ul className="message-list">
        <li className="message-item"><em>·</em>取消机会仅3次/年</li>
        <li className="message-item"><em>·</em>费用将在24小时内退至储值卡中</li>
      </ul>
    </div>
  )
}


const alert = Modal.alert;
const showAlert = () => {
  const alertInstance = alert('Delete', 'Are you sure???', [
    { text: 'Cancel', onPress: () => console.log('cancel'), style: 'default' },
    { text: 'OK', onPress: () => console.log('ok') },
  ]);
  setTimeout(() => {
    // 可以调用close方法以在外部close
    console.log('auto close');
    alertInstance.close();
  }, 500000);
};

class Appointment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courseList: [
        { name: '精品团课', type: 0 },
        { name: '私教课', type: 1 },
      ],
      info: [],
      isLoading: false,
      defualtType: 0,
    }
  }

  toggle(item) {
    if (item.type !== this.state.courseList.type) {
      this.setState({
        defualtType: item.type,
      })
    }
    console.log(item.type)
    appointmentAPI.getList({ courseType: item.type }).then(res => {
      let data = res.data.data.records
      console.log(res)
      let arr = []
      let kind = ''
      let comment = ''
      for ( let index in data ) {
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
        if( data[index].status === 0 ) {
          comment = '排队中'
        } else if ( data[index].status === 1 ) {
          comment = '预约成功'
        } else if ( data[index].status === 2 ) {
          if ( data[index].evalState === 0 ) {
            comment = '未评价'
          } else {
            comment = '已评价'
          }
        } else if ( data[index].status === 3 ) {
          comment = '已取消'
          data[index].classname = 'self-cancel'
        } else if ( data[index].status === 4 ) {
          comment = '已取消'
          data[index].classname = 'opration-cancel'
        }
        arr.push({
          tit: data[index].courseName,
          name: data[index].coachName,
          coursePhoto: data[index].coursePhoto,
          photo:data[index].coursePhoto,
          scheduleId: data[index].scheduleId,
          id: data[index].id,
          startTime: data[index].startTime,
          endTime: data[index].endTime,
          category: kind,
          comment: comment,
          courseName: data[index].courseName,
          classname: data[index].classname
        })
      }
      this.setState({
        info: arr
      })
    })
  }

  componentDidMount() {
    document.title = '我的预约'
    this.setState({
      isLoading: true
    })

    authInit(window).then( res => {
          
      appointmentAPI.getList({ courseType: this.state.defualtType}).then(res => {
        let data = res.data.data.records
        console.log(res)
        let arr = []
        let kind = ''
        let comment= ''
        let classname
        for ( let index in data ) {
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
          if( data[index].status === 0 ) {
            comment = '排队中'
          } else if ( data[index].status === 1 ) {
            comment = '预约成功'
          } else if ( data[index].status === 2 ) {
            if ( data[index].evalState === 0 ) {
              comment = '未评价'
            } else {
              comment = '已评价'
            }
          } else if ( data[index].status === 3 ) {
            comment = '已取消'
            data[index].classname = 'self-cancel'
          } else if ( data[index].status === 4 ) {
            comment = '已取消'
            data[index].classname = 'opration-cancel'
          }
           arr.push({
            tit: data[index].courseName,
            name: data[index].coachName,
            coursePhoto: data[index].coursePhoto,
            date: data[index].scheduleTime,
            photo:data[index].coursePhoto,
            scheduleId: data[index].scheduleId,
            id: data[index].id,
            startTime: data[index].startTime,
            endTime: data[index].endTime,
            category: kind,
            comment: comment,
            courseName: data[index].courseName,
            classname: data[index].classname
          })
        }
        this.setState({
          info: arr,
          isLoading: false
        })
      }) 
    })
  }
  
// 取消预约成功后再次请求api
  cancel(index) {
    let arr = this.state.info
    cancelAPI.cancel({type: this.state.defualtType, id: arr[index].scheduleId}).then( res => {
        if( res.data.code === 0 ) {
          appointmentAPI.getList({ courseType: this.state.defualtType}).then(res => {
            let data = res.data.data.records
            console.log(res)
            let arr = []
            let kind = ''
            let comment= ''
            let classname
            for ( let index in data ) {
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
              if( data[index].status === 0 ) {
                comment = '排队中'
              } else if ( data[index].status === 1 ) {
                comment = '预约成功'
              } else if ( data[index].status === 2 ) {
                if ( data[index].evalState === 0 ) {
                  comment = '未评价'
                } else {
                  comment = '已评价'
                }
              } else if ( data[index].status === 3 ) {
                comment = '已取消'
                data[index].classname = 'self-cancel'
              } else if ( data[index].status === 4 ) {
                comment = '已取消'
                data[index].classname = 'opration-cancel'
              }
              arr.push({
                tit: data[index].courseName,
                name: data[index].coachName,
                coursePhoto: data[index].coursePhoto,
                date: data[index].scheduleTime,
                photo:data[index].coursePhoto,
                scheduleId: data[index].scheduleId,
                id: data[index].id,
                startTime: data[index].startTime,
                endTime: data[index].endTime,
                category: kind,
                comment: comment,
                courseName: data[index].courseName,
                classname : data[index].classname,
              })
            }
            this.setState({
              info: arr,
              isLoading: false
            })
          }) 
        }
    })
  }
  
  linkto(item) {
    if (item.comment === '排队中') {
      this.props.history.push(`/ysuccess?kindof=course&scheduleId=${item.scheduleId}&state=2`)
      return
    }
    if (this.state.defualtType === 0 && item.comment !== "已取消") {
      this.props.history.push(`/ysuccess?kindof=course&scheduleId=${item.scheduleId}`)
    } else if(this.state.defualtType === 1 && item.comment !== "已取消"){
      this.props.history.push(`/ysuccess?kindof=personnal&scheduleIds=${item.scheduleId}&reservid=${item.id}`)
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
          <div className="pic-list">
             {
                this.state.info.length === 0 ?
                (
                  <div className="noda">
                    <img src={require('../../assets/nodata/nodata.png')} alt=""/>
                    <p>暂无数据</p>
                  </div>
                ) : (
                  <ul>
                    {
                      this.state.info.map((item, index) => {
                        return (
                          <li className="pic-item" key={item.id} >
                            <img src={item.coursePhoto ? `${item.coursePhoto}?x-oss-process=image/resize,h_100` : require('../../assets/defaultCarsouel.png') } alt="" onClick={this.linkto.bind(this, item)}  />
                            <div className="intro">
                              {
                               this.state.defualtType == 0 && 
                                (
                                  <p>{item.courseName}·{item.name}</p>
                                )
                              }
                              {
                               this.state.defualtType == 1 &&
                                (
                                  <p>{item.category}·{item.name}</p>
                                )
                              }
                              <p className="time">{allTurnTime(item.startTime)}~{allTurnTime(item.endTime)}</p>
                            </div>
                            {   item.comment !== '已取消'  &&
                              (<WingBlank size="lg">
                                <WhiteSpace size="lg" />
                                <Button className="cancel-btn" onClick={() => alert('提示', <AlertMessage />, [
                                  { text: '取消', onPress: () => console.log('cancel') },
                                  { text: '确定', onPress: this.cancel.bind(this, index) },
                                ])}
                                >取消预约</Button>
                              </WingBlank>)
                          }
                            <div className={`oppoint-status ${item.classname}`}><p>{item.comment}</p></div>
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

export default connect()(Appointment);
