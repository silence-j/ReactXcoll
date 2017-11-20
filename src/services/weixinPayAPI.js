import request from '../utils/request.js'

var wxObj = {
  init(code) {
    return request.get(`/wx/init/params`)
  },
  emCardPay (params) {
    const url = '/xcool/order/create'
    return request.post(url, params)
  }
} 

export default wxObj