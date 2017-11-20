import React from 'react';
import { connect } from 'dva';
import { Modal, Input } from 'antd-mobile'
import './dislog.less';


class Dialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: this.props.isOpen,
      inputValue: '',
      typeoff: this.props.operation
    }
  }
  hideModal = ()=> {
    this.setState({
      visible: false
    })
    this.props.post(this.state.inputValue, 'ok')
  }
  change (e) {
    this.setState({
      inputValue: e.target.value
    })
  }
  cancel = () => {
    this.setState({
      visible: false
    })
    this.props.post(this.state.inputValue, 'notOk')
  }
  render() {
    return (
      <Modal className="dialog"
        visible={this.state.visible}
        onOk={this.hideModal}
        onCancel={this.cancel}
        okText="确认"
        cancelText="取消"
      >
        <input type="text" placeholder={this.state.typeoff} value={this.state.inputValue} onChange={this.change.bind(this)}/>
      </Modal>
    );
  }
}

Dialog.propTypes = {
};

export default connect()(Dialog);
