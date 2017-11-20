import React from 'react';
import { connect } from 'dva';
import { Icon, Rate } from 'antd'
import { NavLink } from 'dva/router'
import './privateCourse.less';

class PrivateCourse extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      start: [1, 2, 3, 4, 5],
      label: ['标签1', '标签2']
    }
  }
  render() {
    let personList = this.props.personList
    return (
      <div className="private">
        <p className="private-name">专业私教课</p>
        {
          personList !== null && personList.length !== 0 ? (
            personList.map((item, index) => {
              return (
                <NavLink to={`/teacher/?id=${item.id}`} key={index}>
                  <div className="info" >
                    {
                      item.photo !== null ? <img className="img" src={item.photo} alt=""/> : <img className="img" src={require('../../../assets/posipic.png')} alt=""/>
                    }
                    <div className="sport-info">
                      <p className="sport-name">{item.courseName}</p>
                      <Rate className="start" disabled allowHalf defaultValue={item.score}></Rate>
                      <p className="p-p">
                        {
                          item.tag.split('|').map((item) => {
                            return <span className="label" key={item}>{item}</span>
                          })
                        }
                      </p>
                    </div>
                  </div>
                </NavLink>
              )
            })
          ) : ''
        }
      </div>
    );
  }
}

PrivateCourse.propTypes = {
};

export default connect()(PrivateCourse);
