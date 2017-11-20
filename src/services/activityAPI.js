import request from '../utils/request.js'

const obj = {
  getList(params) {
    const url = `/xcool/social/activity/getUserActivitiesList?recordFlag=${params.recordFlag}`
    return request.get(url)
  },
}

export default obj
