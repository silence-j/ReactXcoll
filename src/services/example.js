import request from '../utils/request.js'

export function query(code) {
  return request.get(`/wx/user/info?code=${code}`)
}
