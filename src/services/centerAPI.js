import request from '../utils/request.js'

const obj = {
  getInfo(params) {
    const url = `/xcool/user/getUserCenterInfo`
    return request.get(url)
  },
  submit(params) {
    const url = `/xcool/user/updateIntroduction`
    return request.post(url, params)
  },
}

export default obj
