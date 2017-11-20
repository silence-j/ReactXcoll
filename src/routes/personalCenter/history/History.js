import React from 'react';
import { connect } from 'dva';
import { Rate, Button, Input } from 'antd';
import './style.less';
import Camera from '../../social/upload/camera/camera'
import personalAPI from '../../../services/personalAPI'
import qs from 'query-string'
import { Modal } from 'antd-mobile'

class History extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive: false,
      fileList: [],
      feelings: '',
      startNum: 0
    }
  }
  componentDidMount () {
    if(qs.parse(this.props.location.search).which === 'active') {
      this.setState({
        isActive: true
      })
    }
  }
  push() {
    let type
    if (qs.parse(this.props.location.search).which === 'active') {
      type = 2
    } else {
      type = qs.parse(this.props.location.search).type
    }
    let str = ''
    this.state.fileList.forEach((item, index) => {
      if (index + 1 === this.state.fileList.length) {
        str += item.response.data.urlWhole
      } else {
        str += item.response.data.urlWhole + ';'
      }
    })
    let params = {
      type: type,
      id: qs.parse(this.props.location.search).id,
      score: this.state.startNum,
      content: this.state.feelings,
      imgs: str
    }
    if (type === 2) {
      if (this.state.startNum === 0 && this.state.feelings === '' && str === '') {
        Modal.alert('请输入内容', '', [{ text: '确定', onPress: () => {
          console.log('点击了确认')
        } }])
      } else {
        this.pushTo(params)
      }
    } else {
      if (this.state.startNum === 0 && this.state.feelings === ''){
        Modal.alert('请输入内容', '', [{ text: '确定', onPress: () => {
          console.log('点击了确认')
        } }])
      } else {
        this.pushTo(params)
      }
      }

  }
  pushTo (params) {
    personalAPI.courseFeeling(params).then(res => {
      if(!res.data.code) {
        this.props.history.goBack(1)
      }
    })

  }
  //文本框的值
  change (e) {
    this.setState({
      feelings: e.target.value
    })
  }
  //评分值
  chooseStar (e) {
    this.setState({
      startNum: e
    })
  }
  getFileList (fileList) {
    this.setState({
      fileList
    })
  }
  render() {
    const { TextArea } = Input;
    return (
      <div className="container">
        <h2 className="grade">总体评分:</h2>
        <Rate className="start" defaultValue={0} onChange={this.chooseStar.bind(this)} />
        <TextArea className="txtarea" rows={6} placeholder="请输入你想说的" value={this.state.feelings} onChange={this.change.bind(this)} />
        <Button className="btn" type="primary" onClick={this.push.bind(this)} >提交评论</Button>
        {
          this.state.isActive ? (
            <Camera getFileList={this.getFileList.bind(this)}></Camera>
          ) : ''
        }
      </div>
    )
  }
}


export default connect()(History);
