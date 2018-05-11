// 配置API接口地址_测试
// var root = {
//   sapi:'http://sapi.test.mysipo.com/api_v1/',
//   appapi_v2:'http://appapi.test.mysipo.com/app_v2/',
// }
// 配置API接口地址_正式
// var root = {
//   sapi:'http://sapi.mysipo.com/api_v1/',
//   appapi_v2:'http://appapi.mysipo.com/app_v2/',
// }
// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
*/

function apiAxios (method, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: '',
    withCredentials: false
  })
  .then(function (res) {
    if(res.data.code===200||res.data.code===0||res.data.err_no===0) {
      if (success) {
        success(res.data)
      }
    }else{
      // 相关错误级行为操作
      console.log(JSON.stringify(res.data) );
      if(res.code==1006){
          //用户未登录相关操作
      }else if(res.code==1105){
          
      }
      if(failure){
        failure(res.data);
      }
    } 
  })
  .catch(function (err) {
    let res = err.response
    if (err) {
        console.log(err);
    }
  })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}