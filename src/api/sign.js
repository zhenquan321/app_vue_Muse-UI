import $ from './jquery-vendor';
import md5 from './jquery-md5.js';

export default {
    constructor(){
        this.init()
    },
    signAfterObj(obj) {
        obj = obj || {}
        var configDefault = {
            //来源
            source_id: 9,
            //渠道编号
            channel_id: 'app',
            //时间
            timestamp: new Date().getTime(),
            //文件签名
            // filesign: 'b4djwso7geeqgzw4b9l92ga6nmscs8zy',//  zl
            // filesign: 'debb559496dfb5d31a005d67fc0fbc88',//  user
            filesign: 'debb559496dfb5d31a005d67fc0fbc88',//  zl 1
        }
        $.extend(obj, configDefault)
        obj.sign = $.md5(this.keysSort(obj))
        return obj
    },
    md5Sign(value, str) {
        return $.md5($.md5(value) + str)
    },
    keysSort(obj) {
        return Object.keys(obj).sort().filter(function (key) {
            return (key == 'password' || key == 'is_pass') ? false : obj[key] != '' ? true : false
        }).map(function (key) {
            return key + "=" + encodeURIComponent(obj[key])
        }).join('&')
    },
}