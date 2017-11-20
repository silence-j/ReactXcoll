import request from '../utils/request.js'

var partyObj = {
  getParties(params) {
    return request.get(`/xcool/social/activity/list?page=${params.page}&size=10&paging=true`)
  }
} 

export default partyObj