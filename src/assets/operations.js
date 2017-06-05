/**
 * 逻辑处理封装
 * Created by Aeo on 2017/5/25.
 */
import * as Constant from './constant';
import _ from './util';

const MIN_LIMIT = Constant.MIN_LIMIT;

export default {
    /**
     * 图片尺寸发生变化时对热区进行边界情况处理
     * @param {Object} zone       热区模块数据
     * @param {Object} container  图片区域的宽高数据
     */
    limitMin(zone, container) {
        let res = {};
        if(zone.heightPer * container.height < MIN_LIMIT) {
            res.heightPer = _.decimalPoint(MIN_LIMIT / container.height);
        }
        if(zone.widthPer * container.width < MIN_LIMIT) {
            res.widthPer = _.decimalPoint(MIN_LIMIT / container.width);
        }
        if(res.heightPer && zone.topPer + res.heightPer > 1) {
            res.topPer = _.decimalPoint(1 - res.heightPer);
        }
        if(res.widthPer && zone.leftPer + res.widthPer > 1) {
            res.leftPer = _.decimalPoint(1 - res.widthPer);
        }
        return (res.heightPer || res.widthPer || res.topPer || res.leftPer) && res;
    },
    /**
     * 改变热区大小时的边界情况处理
     * @param {Object} itemInfo   实际使用的热区模块数据 
     * @param {Object} styleInfo  操作中的热区模块数据
     * @param {Object} container  图片区域的宽高数据
     */
    dealEdgeValue(itemInfo, styleInfo, container) {
        if(styleInfo.hasOwnProperty('left') && styleInfo.left < 0) {
            styleInfo.left = 0;
            styleInfo.width = itemInfo.width + itemInfo.left;
        }
        if(styleInfo.hasOwnProperty('top') && styleInfo.top < 0) {
            styleInfo.top = 0;
            styleInfo.height = itemInfo.height + itemInfo.top;
        }
        if(!styleInfo.hasOwnProperty('left') && styleInfo.hasOwnProperty('width')) {
            if(itemInfo.left + styleInfo.width > container.width) {
                styleInfo.width = container.width - itemInfo.left;
            }
        }
        if(!styleInfo.hasOwnProperty('top') && styleInfo.hasOwnProperty('height')) {
            if(itemInfo.top + styleInfo.height > container.height) {
                styleInfo.height = container.height - itemInfo.top;
            }
        }
        return Object.assign(itemInfo, styleInfo);
    },
    /**
     * 处理不同的拖拽点，大写字母表示含义：T-top，L-left，C-center，R-right，B-bottom
     * @param  {Object} itemInfo 
     * @param  {Number} moveX 
     * @param  {Number} moveY
     * @return {Object} 对过程数据进行处理
     */
    dealTL(itemInfo, moveX, moveY, minLimit = MIN_LIMIT) {
        let styleInfo = {};
        let width = itemInfo.width - moveX;
        let height = itemInfo.height - moveY;
        if(width >= minLimit && height >= minLimit) {
            styleInfo = {
                width,
                height,
                top: itemInfo.top + moveY,
                left: itemInfo.left + moveX
            };
        }
        return styleInfo;
    },
    dealTC(itemInfo, moveX, moveY, minLimit = MIN_LIMIT) {
        let styleInfo = {};
        let height = itemInfo.height - moveY;
        if(height >= minLimit) {
            styleInfo = {
                height,
                top: itemInfo.top + moveY
            };
        }
        return styleInfo;
    },
    dealTR(itemInfo, moveX, moveY, minLimit = MIN_LIMIT) {
        let styleInfo = {};
        let width = itemInfo.width + moveX;
        let height = itemInfo.height - moveY;
        if(width >= minLimit && height >= minLimit) {
            styleInfo = {
                width,
                height,
                top: itemInfo.top + moveY
            };
        }
        return styleInfo;        
    },
    dealCL(itemInfo, moveX, moveY, minLimit = MIN_LIMIT) {
        let styleInfo = {};
        let width = itemInfo.width - moveX;
        if(width >= minLimit) {
            styleInfo = {
                width,
                left: itemInfo.left + moveX
            };
        }
        return styleInfo;
    },
    dealCR(itemInfo, moveX, moveY, minLimit = MIN_LIMIT) {
        let styleInfo = {};
        let width = itemInfo.width + moveX;
        if(width >= minLimit) {
            styleInfo = {
                width
            };
        }
        return styleInfo;
    },
    dealBL(itemInfo, moveX, moveY, minLimit = MIN_LIMIT) {
        let styleInfo = {};
        let width = itemInfo.width - moveX;
        let height = itemInfo.height + moveY;
        if(width >= minLimit && height >= minLimit) {
            styleInfo = {
                width,
                height,
                left: itemInfo.left + moveX
            };
        }
        return styleInfo;
    },
    dealBC(itemInfo, moveX, moveY, minLimit = MIN_LIMIT) {
        let styleInfo = {};
        let height = itemInfo.height + moveY;
        if(height >= minLimit) {
            styleInfo = {
                height
            };
        }
        return styleInfo;
    },
    dealBR(itemInfo, moveX, moveY, minLimit = MIN_LIMIT) {
        let styleInfo = {};
        let width = itemInfo.width + moveX;
        let height = itemInfo.height + moveY;
        if(width >= minLimit && height >= minLimit) {
            styleInfo = {
                width,
                height
            };
        }
        return styleInfo;
    }
};