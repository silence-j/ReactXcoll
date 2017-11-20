import request from '../utils/request.js'

const obj = {
  getCoachDoorQRCode(params) {
    const url = `/xcool/door/getCourseDoorKey?scheduleId=${params.scheduleId}`
    return request.get(url)
  },
  getCoachList(params) {
    const url = `/xcool/coach/getList?page=${params.page}`
    return request.get(url)
  },
  //图片上传
  postImg(params) {
    const url = `/xcool/system/pic/upload`
    return request.post(url, params)
  },
  //活跃用户列表
  getActiveUser(params) {
    const url = `/xcool/social/post/activity/member/list`
    return request.get(url)
  },
//  帖子列表/social/post/list
  getPostList(params) {
    const url = `/xcool/social/post/list?queryType=${params.queryType}&page=${params.page}&size=${params.size}`
    return request.get(url)
  },
// 发帖
  postInfo(params) {
    const url = `/xcool/social/post/push`
    return request.post(url, params)
  },
//  活动详情
  getActiveDetail(params) {
    const url = `/xcool/social/activity/detail?activityId=${params.activityId}`
    return request.get(url)
  },
  // 关注
  getFollow(params) {
    const url = `/xcool/social/activity/follow?activityId=${params.activityId}`
    return request.get(url, params)
  },
  // 报名
  getEnroll(params) {
    const url = `/xcool/social/activity/sign?activityId=${params.activityId}`
    return request.get(url, params)
  },
  // 点赞
  praise(params) {
    const url = `/xcool/social/post/praise`
    return request.post(url, params)
  },
  // 查询话题
  getTopic(params) {
    const url = `/xcool/topic/listTop?size=${params.size}`
    return request.get(url, params)
  },
  // 引用话题
  useTopic(params) {
    const url = `/xcool/topic/addRefCount`
    return request.post(url, params)
  },
  // 创建话题
  setTopic(params) {
    const url = `/xcool/topic/create`
    return request.post(url, params)
  },
  // 评论
  postComment(params) {
    const url = `/xcool/social/post/comment`
    return request.post(url, params)
  },
  // 回复
  postReply(params) {
    const url = `/xcool/social/post/reply`
    return request.post(url, params)
  },
  // 删除帖子
  postDel(params) {
    const url = `/xcool/social/post/delete`
    return request.post(url, params)
  },
  // 课程评价
  courseFeeling(params) {
    const url = `/xcool/course/evaluate`
    return request.post(url, params)
  },
  // 运动建议
  getSportAd(params) {
    const url = `/xcool/sportdata/sportSuggest`
    return request.get(url, params)
  },

}

export default obj
