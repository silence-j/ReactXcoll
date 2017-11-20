import request from '../utils/request.js'

const obj = {
  cancel(params) {
    const url = `/xcool/course/reserve/cancel`
    return request.post(url, params)
  },
}

export default obj