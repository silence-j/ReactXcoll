import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { Picker, DatePicker } from 'antd-mobile'
// import 'antd-mobile/lib/picker/style/index.css';
import 'antd-mobile/dist/antd-mobile.css'
import PickerItem from './PickerItem.jsx'
import { Link } from 'dva/router';
import qs from 'query-string'
import { dateFormat } from '../../../../../utils/dateFormat.js'
import './style.less';

const { MonthPicker, RangePicker } = DatePicker;
class PersonalInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: [
        { num: 159 },
        { num: 160 },
        { num: 161 },
      ],
      weightL: [
        { integer: 80 },
        { integer: 81 },
        { integer: 82 }
      ],
      weightR: [
        { decimal: 0 },
        { decimal: 1 }
      ],
      weight: [[], []],
      weightVal: [65, 0],
      dateVal: '1993-01-01',
      sex: 1,
      selectedVal: 30,
      sleWight: 0,
      sleWightR: 0,
    }
  }

  componentDidMount () {
     document.title = '完善信息'
   }
  componentWillMount() {
    let weightArr = [[], []]
    let arr = []
    for ( let i = 140 ; i <=230; i++ ){
      arr.push({
        num: i
      })
    }
    for ( let i = 40 ; i <= 150; i++ ){
      weightArr[0].push({ label: i, value: i, })
    }
    for ( let i = 0 ; i <= 9; i++ ){
      weightArr[1].push({ label: `.${i}`, value: i, })
    }
    this.setState({
      height: arr,
      weight: weightArr
    })
  }
// 初始化option的值
// 缓存用户输入的个人数据
  getRecommend() {
      localStorage.sex = this.state.sex
      localStorage.height = this.state.height[this.state.selectedVal].num
      localStorage.weight = this.state.weightVal[0] + (this.state.weightVal[1] * 0.1)
      localStorage.birth = this.state.dateVal
  }

  toggle() {
    if (this.state.sex === 1) {
      this.setState({
        sex: 2,
         weightVal: [45, 0],
         selectedVal: 25,
      })
    } else {
      this.setState({
        sex: 1,
        weightVal: [65, 0],
        selectedVal: 30,
      })
    }
  }

  selectHeight(e) {
    let val = e.target.value
    this.setState({
      selectedVal: val
    })
  }
  confirmWeight (val) {
    this.setState({
      weightVal: val
    })
  }

  onChange(date) {
    this.setState({
      dateVal: dateFormat(date)
    })
  }

  render() {
    return (
      <div className="target-container">
        <h2>X-COOL将根据您的资料为您提供专业健身指导</h2>
        <div className="target-content">
          <h2>性别</h2>
          <div className="choose-sex">
            <span className={`male ${this.state.sex === 1 ? 'active' : ''}`} onClick={this.toggle.bind(this)}>
              <i className="iconfont">&#xe650;</i>  
            </span>
            <span className={`female ${this.state.sex === 2 ? 'active' : ''}`} onClick={this.toggle.bind(this)}>
              <i className="iconfont">&#xe64f;</i>
            </span>
          </div>
          <div className="height">
            <h2>身高</h2>
            <div className="choose">
              <span className="left" />
              <select className="slct" value={this.state.selectedVal} name="" id="" onChange={this.selectHeight.bind(this)}>{
                this.state.height.map((item, index) => {
                  return(
                    <option  value={index} key={index}>{item.num}cm</option>
                  )
                })
              }
              </select>
              <span className="right" />
            </div>
          </div>
          <div className="weight">
            <h2>体重</h2>
            <div className="choose">
              <span className="left" />
                <Picker data={this.state.weight} onChange={this.confirmWeight.bind(this)} value={this.state.weightVal} cascade={false}>
                   <PickerItem unit="Kg"></PickerItem>
                </Picker>
              <span className="right" />
            </div>
          </div>
          <div className="birth">
            <h2>出生年月</h2>
            <div className="choose">
              <span className="left birth-left" />
              <span className="mid">
                <DatePicker extra={this.state.dateVal} mode="date" onChange={this.onChange.bind(this)} minDate={new Date('1900-01-01')} maxDate={new Date()}>
                  <PickerItem></PickerItem>
                </DatePicker>
              </span>
              <span className="right birth-right" />
            </div>
          </div>
        </div>
        <Link to="/target">
          <Button type="primary" className="next" onClick={this.getRecommend.bind(this)}>下一步</Button>
        </Link>
      </div>
    )
  }
}

export default connect()(PersonalInfo)
