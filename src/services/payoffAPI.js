import request from '../utils/request.js'

const obj = {
  //  创建订单并支付(购买精品团课)
  getOrder(params) {
    const url = `/xcool/order/create`
    return request.post(url, params)
  },
  // 用户手机是否被绑定
  getNumber(params) {
    const url = `/xcool/user/get`
    return request.get(url)
  },
  emCardPay(params) {
    const url = '/xcool/order/create'
    return request.post(url, params)
  }
}

export default obj
