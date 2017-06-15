/**
 * 改变元素宽高 directive
 * @param {Object} elem 
 */
import { dom } from 'regularjs';
import operations from '../operations';
import _ from '../util';

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
        let container = _.getOffset(zone.parentNode);
        let itemInfo = {
            width: _.getOffset(zone).width || 0,
            height: _.getOffset(zone).height || 0,
            top: setting.topPer * container.height || 0,
            left: setting.leftPer * container.width || 0
        };
        let preX = _.getPageX(e);
        let preY = _.getPageY(e);
        let flag;

        // 隐藏 hover 显示的信息
        self.hideZone(true);

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
                self.changeInfo(perInfo);

                // 兼容数据无变更情况下导致 computed 不更新，数据仍为 px 时 resize 出现的问题
                dom.css(zone, {
                    top: `${perInfo.topPer * 100}%`,
                    left: `${perInfo.leftPer * 100}%`,
                    width: `${perInfo.widthPer * 100}%`,
                    height: `${perInfo.heightPer * 100}%`
                });
            }
            // 显示 hover 显示的信息
            self.hideZone(false);

            dom.off(window, 'mousemove', handleChange);
            dom.off(window, 'mouseup', handleMouseUp);
        }
    };

    return () => {
        dom.off(elem, 'mousedown', handleMouseDown);
    };
};