import React from 'react';
import { connect } from 'dva';
import './courseProcess.less';

class CourseProcess extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      star: [1, 2, 3, 4, 5]
    }
  }
  render() {
    var item = this.props.cList
    return (
      <li key={item.name}>
        {
          item.name == '服务流程' ?
                   <span>
                      <p className="course-name">{item.name}</p>
                       <div className="process">
                         {
                           item.process.map((orderItem) => {
                             return <div key={orderItem.order} className="process-order">
                               <span className="process-num">{orderItem.order}</span>
                               <span className="process-des">{orderItem.text}</span>
                               {
                                 orderItem.order !== 3 ? <p className="line"></p> : ''
                               }
                             </div>
                           })
                         }
                        </div>
                    </span>
                    :
                    <span>
                      <p className="course-name">{item.name}</p>
                      <p  className={item.name == '课程简介' ? 'x-cool howLine2' : 'x-cool howLine2 distance'}>
                      {item.content}
                      </p>
                   </span>
        }
      </li>
    )
  }
}

CourseProcess.propTypes = {
};

export default connect()(CourseProcess);