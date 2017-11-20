import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { NavLink } from 'dva/router'

import './style.less';
import { Upload, Icon, Modal } from 'antd';

class IndexPage extends React.Component {
	constructor(props) {
		super(props)
	}

	state = {
		previewVisible: false,
		previewImage: '',
		fileList: [],
	};

	handleCancel = () => this.setState({
		previewVisible: false
	})

	handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}

  handleChange = ({fileList})=>{
		if(fileList.length > 9) {
			return
		} else {
      this.setState({
        fileList
      })
		}
    this.props.getFileList(fileList)
    console.log('******')
    console.log(fileList)
  }
	render() {
		const {
			previewVisible,
			previewImage,
			fileList
		} = this.state;
		const uploadButton = (
			<div>
				{/*<span className="iconfont">&#xe627;</span>*/}
        <Icon type="plus" />
        {/*<div className="ant-upload-text">Upload</div>*/}
      </div>
		);
		return(
			<div className="clearfix minHeight">
        <Upload
          action="http://servertest.loonxi.com/xcool/system/pic/upload"
					name="picture"
					multiple = {true}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 9 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
		);
	}
}

IndexPage.propTypes = {};

export default connect()(IndexPage);