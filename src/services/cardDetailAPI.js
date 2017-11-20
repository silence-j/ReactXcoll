import request from '../utils/request.js'

const obj = {
  getPrice(params) {
    const url = `/xcool/card/getByType?type=${params.type}`
    return request.get(url)
  },
   // 用户手机是否被绑定
  getNumber(params) {
    const url = `/xcool/user/get`
    return request.get(url)
  }
}

export default obj
