import request from '../utils/request.js'

const obj = {
  getCard(params) {
    const url = `/xcool/card/getUserCard`
    return request.get(url)
  },
}

export default obj