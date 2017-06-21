export default {
    /**
     * 限制不可输入空格
     * @param val
     * @return {string}
     */
    trim: {
        get(val) {
            return val;
        },
        set(val) {
            return val.trim() || '';
        }
    },
    /**
     * 将 checkbox 值转换为数字
     * @param {Boolean} val
     * @return {Number}
     */
    toNum: {
        get(val) {
            return val;
        },
        set(val) {
            return val ? 1 : 0;
        }
    },
    /**
     * 跳转方式的文字显示
     * @param {Number} target 
     */
    jumpWay(target) {
        let info = {
            0: '当前页面打开',
            1: '新开页面'
        };
        return info[target];
    },
    /**
     * 跳转方式的实际 target
     * @param {Number} target 
     */
    getTarget(target) {
        let info = {
            0: '_self',
            1: '_blank'
        };
        return info[target];
    }
};