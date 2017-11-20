import request from '../utils/request.js'

const obj = {
  
  //  完善个人资料
  sentInfo(params) {
    const url = `/xcool/user/updateBaseInfo`
    return request.post(url, params)
  },
}

export default obj
