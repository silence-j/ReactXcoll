import request from '../utils/request.js'

const obj = {
  
  //  完善个人资料
  aprise(params) {
    const url = `/xcool/user/updateBaseInfo`
    return request.post(url, params)
  },
}

export default obj
