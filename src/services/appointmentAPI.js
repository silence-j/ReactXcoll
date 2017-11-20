import request from '../utils/request.js'

const obj = {
  getList(params) {
    const url = `/xcool/course/reserve/list?courseType=${params.courseType}&reserveFlag=true`
    return request.get(url)
  },
  cancel(params) {
    const url = `/xcool/course/reserve/cancel?type=${params.type}&id=${params.id}`
    return request.get(url)
  }
}

export default obj
