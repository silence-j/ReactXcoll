import request from '../utils/request.js'

var accountObj = {
  getbuyList() {
    return request.get('/xcool/account/list')
  },
  getUerInfo() {
    return request.get('/xcool/user/get')
  },
} 

export default accountObj