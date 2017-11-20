import request from '../utils/request.js'

const obj = {
  getActivi(params) {
    const url = `/xcool/social/activity/evaluate`
    return request.post(url, params)
  },
  getCourse(params) {
    const url = `/xcool/course/evaluate`
    return request.post(url, params)
  },
}

export default obj