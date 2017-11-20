import { query } from '../services/example.js'



function authObj (window) {
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if(r != null)
      context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
  }
  return new Promise((resolve, reject) => {
      query(getQueryString("code")).then(res=>{
        console.log('auth')
        localStorage.user = JSON.stringify(res.data.data)
        resolve(res)
      })
  })
  
}

export default authObj
