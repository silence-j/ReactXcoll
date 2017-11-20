import request from '../utils/request.js'

var partyObj = {
  getQRCode(code) {
    return request.get('/xcool/door/getMainDoorKey')
  },
  getWashroomKeyQRCode(code) {
    return request.get('/xcool/door/getWashroomKey')
  },
  refrsh(code) {
    return request.get('/xcool/door/resetMainDoor')
  },
  getUser() {
    return request.get('/xcool/user/get')
  }
} 

export default partyObj