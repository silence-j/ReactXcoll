import request from '../utils/request.js'

const obj = {
  getGroupList(params) {
    const url = `/xcool/course/groupList?date=${params.date}&category=${params.category}`
    return request.get(url)
  },
  getJoiner(params) {
    const url = `/xcool/social/activity/getMembersByActivityId?activityId=${params.activityId}`
    return request.get(url)
  },

  //  团课详情
  getCourseDetail(params) {
    const url = `/xcool/course/getGroupCourseDetail?scheduleId=${params.scheduleId}`
    return request.get(url)
  },
  //  教练详情
  getCoachDetail(params) {
    const url = `/xcool/coach/getDetail?id=${params.id}`
    return request.get(url)
  },
  //  获取用户详情
  getUserInfo() {
    const url = '/xcool/user/get'
    return request.get(url)
  },
  //  创建订单并支付(购买精品团课)
  getOrder(params) {
    const url = `/xcool/order/create`
    return request.post(url, params)
  },
  //  取消预约
  cancelOrder(params) {
    const url = `/xcool/course/reserve/cancel`
    return request.post(url, params)
  },
  //  留言板：用户评价
  getMsgComment(params) {
    const url = `/xcool/course/queryComment?type=${params.type}&id=${params.id}`
    return request.get(url)
  },
}

export default obj
