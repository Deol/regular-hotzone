/**
 * Created by Aeo on 2017/5/25.
 */
import * as Constant from './constant';

let _ = {};

/**
 * 简单对象合并
 * 注意：这里只能合并第一层子属性，第二层没办法
 * @param  {Object} o1
 * @param  {Object} o2
 * @param  {Boolean} override
 * @return {Object} 返回合并后的对象
 */
_.extend = (o1, o2, override = false) => {
    for(let i in o2){
        if(o1[i] === undefined || o1[i] === null || override){
            if(o2[i] !== undefined){
                o1[i] = o2[i];
            }
        }
    }
    return o1;
};

/**
 * 判断链接是否符合要求
 * @param {String} url
 * @return {Boolean} 返回判断结果
 */
_.checkUrl = (url) => {
    let pattern = new RegExp('^(http[s]?:\\/\\/)' +           // 协议（必须填写 http 或者 https）
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // 域名
        '((\\d{1,3}\\.){3}\\d{1,3}))' +                       // IP 地址
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +                   // 端口和通道
        '(\\?[\\d\\D]*)?' +                                   // 查询参数(允许一切字符)
        '(\\#[-a-z\\d_]*)?$', 'ig');                          // 锚点
    return pattern.test(url);
};

/**
 * 获取 10 的常量值次方的幂结果
 * @return {Number}
 */
_.getMultiple = () => {
    return Math.pow(10, Constant.DECIMAL_PLACES);
};

/**
 * 限制小数位数
 * @param  {Number} num  传入的待处理数字
 * @return {Number}      处理后返回的数字
 */
_.decimalPoint = (val) => {
    return Math.round(val * _.getMultiple()) / _.getMultiple();
};

/**
 * 获取兼容过的 pageX
 * @param  {Object} e
 * @return {Number}
 */
_.getPageX = (e) => {
    return e.hasOwnProperty('pageX') ? e.pageX : e.touches[0].pageX;
};

/**
 * 获取兼容过的 pageY
 * @param  {Object} e
 * @return {Number}
 */
_.getPageY = (e) => {
    return e.hasOwnProperty('pageY') ? e.pageY : e.touches[0].pageY;
};

/**
 * 获取鼠标点击处相对于目标节点的横坐标值
 * @param  {Object} e           鼠标点击事件
 * @param  {Object} container   目标节点
 * @return {Number}             鼠标点击处距离目标节点起点的横坐标
 */
_.getDistanceX = (e, container) => {
    return _.getPageX(e) - (container.getBoundingClientRect().left + window.pageXOffset);
};

/**
 * 获取鼠标点击处相对于目标节点的纵坐标值
 * @param  {Object} e           鼠标点击事件
 * @param  {Object} container   目标节点
 * @return {Number}             鼠标点击处距离目标节点起点的纵坐标
 */
_.getDistanceY = (e, container) => {
    return _.getPageY(e) - (container.getBoundingClientRect().top + window.pageYOffset);
};

/**
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param {Function}  fn         需要调用的函数
 * @param {Number}    delay      延迟时间，单位毫秒
 * @param {Boolean}   debounce   是否为debounce：true-debounce, false-throttle
 * @param {Boolean}   immediate  给 immediate 参数传递true绑定的函数先执行，而不是delay后后执行。
 * @return {*|Function}  实际调用函数
 * 使用:
 *    let thrFn = _.throttle(function() {...}, 300); // 不可写箭头函数
 *    thrFn();
 */
_.throttle = function(fn, delay, debounce = false, immediate = false) {
    let curr = +new Date(), // 当前时间
        lastCall = 0,       // 最后一次调用
        lastExec = 0,       // 最后一次执行
        timer = null,       // 计时器timeout的ID
        diff,               // 时间差
        context,            // 函数执行上下文
        args,               // 参数
        exec = function() { // 执行器
            lastExec = curr;
            fn.apply(context, args);
        };
    return function() {
        curr= +new Date();
        context = this;
        args = arguments;
        diff = curr - (debounce ? lastCall : lastExec) - delay;
        timer && clearTimeout(timer);
        if (debounce) {
            if (!immediate) {
                timer = setTimeout(exec, delay);
            } else if (diff >= 0) {
                exec();
            }
        } else {
            if (diff >= 0) {
                exec();
            } else if (!immediate) {
                timer = setTimeout(exec, -diff);
            }
        }
        lastCall = curr;
    };
};

/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
 * @param  {function} fn         要调用的函数
 * @param  {number}   delay      空闲时间
 * @return {function} 实际调用函数
 * 使用:
 *    let dbcFn = _.debounce(function(){...}, 300); // 不可写箭头函数
 *    dbcFn();
 */
_.debounce = function(fn, delay) {
    return _.throttle(fn, delay, true);
};

export default _;