import request from '../utils/request.js'

const obj = {
  getCourse(params) {
    const url = `/xcool/course/reserve/list?page=${params.page}&size=${params.size}&courseType=${params.courseType}`
    return request.get(url)
  },
}

export default obj

