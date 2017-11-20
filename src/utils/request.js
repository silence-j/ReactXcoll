import fetch from 'dva/fetch';
import { domain } from './config.js'
import { Toast } from 'antd-mobile'
import qs from 'query-string'

function parseJSON(response) {
  return response.json();
}

// 后端异常输出
function alertError(response) {
  if (response.code) {
    Toast.offline(response.message, 2, () => {
      console.log('something wrong')
    }, true)
  }
  return response;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

const request = {
  get(url, options) {
    const optionDist = {}
    Object.assign(optionDist, options || {}, { credentials: 'include',mode: "cors"})
    return fetch(`${domain}${url}`, optionDist)
      .then(checkStatus)
      .then(parseJSON)
      .then(alertError)
      .then(data => ({ data }))
      .catch(err => ({ err }));
  },
  post(url, params) {
  	let options = {
    	method: 'post',
      mode: "cors",
    	headers: {
    		'Content-Type': 'application/x-www-form-urlencoded'
    	},
    	credentials: 'include',
    	body: qs.stringify(params)
   }
    return fetch(`${domain}${url}`, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(alertError)
      .then(data => ({ data }))
      .catch(err => ({ err }));
  },
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default request
