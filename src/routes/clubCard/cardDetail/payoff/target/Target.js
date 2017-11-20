import React from 'react';
import { connect } from 'dva';
import { Toast, Button } from 'antd-mobile';
import personalInfoAPI from '../../../../../services/personalInfoAPI'
import './style.less';

class Target extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tit: '',
      target: '',
      targetList: [
          { sport: '减脂',value: 0, isChecked: false },
          { sport: '增肌', value: 1, isChecked: false },
          { sport: '塑形', value: 2, isChecked: false },
          { sport: '增强心肺能力', value: 3, isChecked: false },
      ],
      targetStr: [],
      actualityItem: [
          { standard: '零基础', time: '一周一次', sportSituation: 0 },
          { standard: '有经验', time: '一周两至三次',sportSituation: 1 },
          { standard: '经验丰富', time: '一周四次以上', sportSituation: 2 },
      ],
      defualtValue: 4,
      strTarget: ''
    }
  }

   componentDidMount () {
     document.title = '完善信息'
   }
  toggle(item) {
    if (item.sportSituation !==this.state.defualtValue ) {
      this.setState({
        defualtValue: item.sportSituation
      })
    }
  }

  done() {
    let recommendPerson = localStorage.sell_way == 1 ? localStorage.seller : null
    console.log(recommendPerson)
    personalInfoAPI.sentInfo({
       sex: localStorage.sex,
       height:localStorage.height,
       weight:localStorage.weight,
       birthday: localStorage.birth,
       recommendType: localStorage.sell_way,
       recommendPerson,
       sportGoal:this.state.strTarget,
       sportSituation:this.state.defualtValue,
      }).then(res => {
        Toast.info('提交成功!', 2, () => {
          let source = window.localStorage.source
          let sourceId = window.localStorage.sourceId
          if (source === 'course') {
            this.props.history.push({
              pathname: '/ysuccess',
              search: `?kindof=course&scheduleId=${sourceId}`
            })
          }
          if(source === 'active') {
            this.props.history.push({
              pathname: '/ysuccess',
              search: `?kindof=active&activityId=${sourceId}`
            })
          }
          if(source === 'wpay') {
            this.props.history.push({
              pathname: '/teacher',
              search: `?id=${localStorage.teacherflag}`
            })
          } if(source === 'card') {
            this.props.history.push('/myClubCard')
          }
        },true);  
      })
  }

  selectTarget(index) {
    let arr = this.state.targetList
    let strList = this.state.targetStr
    let i = strList.indexOf(arr[index].value)
    if (i < 0) {
      strList.push(arr[index].value)
    } else {
      strList.splice(i, 1)
    }
    arr[index].isChecked = !arr[index].isChecked
    console.log(strList.join())
    this.setState({
      targetList: arr,
      strTarget: strList.join(),
    })
  }

  render() {
    return (
      <div className="container-wrap">
        <h2>X-COOL将根据您的资料为您提供专业健身指导</h2>
        <div className="content-wrap">
          <h1>运动目标</h1>
          <div className="target">
            <ul className="target-list">{
              this.state.targetList.map((item, index) => {
                return (
                  <li className={`target-item ${item.isChecked ? 'active' : ''}`} key={item.sport} onClick={this.selectTarget.bind(this, index)} >
                    <span>{item.sport}</span>
                    <div className="check-box">
                      <i className="iconfont">&#xe680;</i>
                    </div>
                  </li>
                )
              })
            }
            </ul>
          </div>
          <h2>运动现状</h2>
          <ul className="actuality-list">{
            this.state.actualityItem.map((item) => {
              return (
                <li className="actuality-item" key={item.standard}>
                  <div className={`basics ${item.sportSituation === this.state.defualtValue ? 'active' : ''}`} onClick={this.toggle.bind(this, item)}>{item.standard}</div>
                  <p>{item.time}</p>
                </li>
              )
            })
          }
          </ul>
          <Button type="primary" className="done" onClick={this.done.bind(this)}>完成</Button>
        </div>
      </div>
    )
  }
}

export default connect()(Target)
