import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { NavLink } from 'dva/router'
import { Input, Button } from 'antd'
import { Modal } from 'antd-mobile'
import personalAPI from '../../../services/personalAPI'
import Camera from "./camera/camera.jsx"
import './style.less';
// import enCode from '../../../utils/enCode.js'


class IndexPage extends React.Component {
  constructor (props) {
    super(props)
		this.state = {
    	content: '',
      fileList: [],
			topic: [],
			num: 200,
      type: ''
		}
  }
  componentDidMount () {
    document.title = '发布'
    //获取话题
    this.topicList()
  }
  //话题
  topicList () {
  	personalAPI.getTopic({size: 10}).then(res => {
  		if(!res.data.code) {
  			this.setState({
  				topic: res.data.data
				})
			}
		})
  }
  //发帖
  postInfo () {
  	let str = ''
    this.state.fileList.forEach((item, index) => {
      if (index + 1 === this.state.fileList.length) {
  			str += item.response.data.urlWhole
			} else {
  			str += item.response.data.urlWhole + ';'
			}
		})
    let params = {
      title: 'hello',
      content: this.state.content,
      pic: str
		}
    personalAPI.postInfo(params).then(res => {
      if(!res.data.code) {
      	this.setState({
          content: '',
          fileList: []
				})
				this.props.history.push({
					pathname: '/indexCool/social/socialHot'
				})
			}
    })
  }
  getFileList (fileList) {
    this.setState({
  		fileList
		})
  }

  //获取文本框的值
	change (e) {
    if (e.target.innerHTML.value > 200) {
  		alert('字数超限')
		} else {
      this.setState({
        content: e.target.value,
        num: 200-(e.target.value.length)
      })
		}

	}
  //引用话题
  useTopic (id, topic) {
    personalAPI.useTopic({topicId: id}).then(res => {
      if(!res.data.code) {
        // var arr = this.state.content + `<span className="topicContent">${topic}</span>`
        var arr = this.state.content + topic
        this.setState({
          content: arr,
          num: 200-(arr.length)
        })
      }
    })
  }
  //发起话题
  setTopic (val) {
    Modal.prompt(
      '',
      '',
      [
        { text: '取消' ,
          onPress: (val) => {
            this.postTo(val, 'notOk')

          }
        },
        {
          text: '提交',
          onPress: (val) => {
            this.postTo(val, 'ok')
            console.log(val)
          }
        },
      ],
      'default', null,
      ['#发起话题#']
    )
  }
  // 发布话题
  postTo (value, operation) {
    if (operation === 'ok') {
      personalAPI.setTopic({topicName: value}).then(res => {
        if(!res.data.code) {
          this.topicList()
        }
      })
    } else if (operation === 'notOk'){

    }
  }
  render() {
    const { TextArea } = Input
    return (
      <div className="home-view">
        <div className="top-box">

          <TextArea value={this.state.content} onChange={this.change.bind(this)} />
          {/*<div className="textarea" onInput={this.change.bind(this)} contentEditable dangerouslySetInnerHTML={{__html: this.state.content}}></div>*/}
        	<div className="limit">
        		<span>{this.state.num}</span>
        	</div>
					{
						this.state.topic !== null ? (
							<ul className="say-title">
                <li className="setTopic" onClick={this.setTopic.bind(this)}>+发起话题</li>
								{
                  this.state.topic.map((item, index) => {
                    return <li key={index} onClick={this.useTopic.bind(this, item.id, item.topic)}>{item.topic}</li>
                  })
								}
							</ul>
						) : ''
					}
        </div>
        <Camera getFileList={this.getFileList.bind(this)}></Camera>
        <button className="order" onClick={this.postInfo.bind(this)}>发表</button>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
