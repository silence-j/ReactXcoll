import request from '../utils/request.js'

const obj = {
  getCode(params) {
    const url = `/xcool/sms/send`
    return request.post(url, params)
  },
  doBind(params) {
    const url = `/xcool/user/bind/mobile`
    return request.post(url, params)
  },
  cancelBind(params) {
    const url = `/xcool/user/unbind/mobile`
    return request.post(url, params)
  },
  loverBind(params) {
    const url = `/xcool/order/create`
    return request.post(url, params)
  },
}

export default obj