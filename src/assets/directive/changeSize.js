/**
 * 改变元素宽高 directive
 * @param {Object} elem 
 */
import { dom } from 'regularjs';
import * as Constant from '../constant';
import operations from '../operations';
import _ from '../util';

// 热区块的最小大小限制
const MIN_LIMIT = Constant.MIN_LIMIT;

export default function changeSize(elem) {
    let self = this;

    dom.on(elem, 'mousedown', handleMouseDown);

    function handleMouseDown(e) {
        let pointer = e.target.dataset.pointer;
        if(!pointer) {
            return;
        }
        e && e.stopPropagation();

        let zone = elem.parentNode;
        let setting = self.data.setting;
        let container = dom.getOffset(zone.parentNode);
        let itemInfo = {
            width: dom.getOffset(zone).width,
            height: dom.getOffset(zone).height,
            top: setting.topPer * container.height,
            left: setting.leftPer * container.width
        };
        let preX = _.getPageX(e);
        let preY = _.getPageY(e);
        let flag;

        // 隐藏 hover 显示的信息
        self.hideInfo(true);

        dom.on(window, 'mousemove', handleChange);
        dom.on(window, 'mouseup', handleMouseUp);

        function handleChange(e) {
            e && e.preventDefault();
            flag = true;

            let moveX = _.getPageX(e) - preX;
            let moveY = _.getPageY(e) - preY;
            
            preX = _.getPageX(e);
            preY = _.getPageY(e);

            // 处理选中不同拖拽点时的情况
            let styleInfo = operations[pointer](itemInfo, moveX, moveY);

            // 边界值处理
            itemInfo = operations.dealEdgeValue(itemInfo, styleInfo, container);
            
            dom.css(zone, {
                top: `${itemInfo.top}px`,
                left: `${itemInfo.left}px`,
                width: `${itemInfo.width}px`,
                height: `${itemInfo.height}px`
            });
        }
        function handleMouseUp() {
            if(flag) {
                flag = false;
                let perInfo = {
                    topPer: _.decimalPoint(itemInfo.top / container.height),
                    leftPer: _.decimalPoint(itemInfo.left / container.width),
                    widthPer: _.decimalPoint(itemInfo.width / container.width),
                    heightPer: _.decimalPoint(itemInfo.height / container.height)
                };
                self.changeSetting(perInfo);

                // 兼容数据无变更情况下导致 computed 不更新，数据仍为 px 时 resize 出现的问题
                dom.css(zone, {
                    top: `${perInfo.topPer * 100}%`,
                    left: `${perInfo.leftPer * 100}%`,
                    width: `${perInfo.widthPer * 100}%`,
                    height: `${perInfo.heightPer * 100}%`
                });
            }
            // 显示 hover 显示的信息
            self.hideInfo(false);

            dom.off(window, 'mousemove', handleChange);
            dom.off(window, 'mouseup', handleMouseUp);
        }
    };

    // 屏幕大小发生变化时保持最小尺寸
    let preContainer;
    dom.on(window, 'resize', () => {
        if(!elem || !elem.parentNode || !elem.parentNode.parentNode) {
            return;
        }
        
        let setting = self.data.setting;
        let zone = dom.getOffset(elem.parentNode);
        let container = dom.getOffset(elem.parentNode.parentNode);

        if(preContainer && container.width === preContainer.width) {
            return;
        }
        preContainer = container;

        if(zone.height < MIN_LIMIT) {
            self.changeSetting({
                heightPer: _.decimalPoint(MIN_LIMIT / container.height)
            });
        }
        if(zone.width < MIN_LIMIT) {
            self.changeSetting({
                widthPer: _.decimalPoint(MIN_LIMIT / container.width)
            });
        }
        if(setting.topPer + setting.heightPer > 1) {
            self.changeSetting({
                topPer: 1 - setting.heightPer
            });
        }
        if(setting.leftPer + setting.widthPer > 1) {
            self.changeSetting({
                leftPer: 1 - setting.widthPer
            });
        }
    });

    return () => {
        dom.off(elem, 'mousedown', handleMouseDown);
    };
};