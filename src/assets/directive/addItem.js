/**
 * 生成元素 directive
 * @param {Object} content 
 */
import { dom } from 'regularjs';
import * as Constant from '../constant';
import operations from '../operations';
import _ from '../util';

// 生成元素 directive 需要特殊处理，最小热区大小限制为 0
const MIN_LIMIT = Constant.MIN_LIMIT;

export default function addItem(content) {
    let self = this;

    dom.on(content, 'mousedown', handleMouseDown);

    function handleMouseDown(e) {
        e && e.preventDefault();

        let itemInfo = {
            top: _.getDistanceY(e, content),
            left: _.getDistanceX(e, content),
            width: 0,
            height: 0
        };
        let container = _.getOffset(content);
        // 仅仅在一开始初始化的时候用了一次
        let setting = {
            topPer: _.decimalPoint(itemInfo.top / container.height),
            leftPer: _.decimalPoint(itemInfo.left / container.width),
            widthPer: 0,
            heightPer: 0
        };
        let preX = _.getPageX(e);
        let preY = _.getPageY(e);

        self.addItem(setting);

        dom.on(window, 'mousemove', handleChange);
        dom.on(window, 'mouseup', handleMouseUp);

        function handleChange(e) {
            e && e.preventDefault();

            let moveX = _.getPageX(e) - preX;
            let moveY = _.getPageY(e) - preY;
            preX = _.getPageX(e);
            preY = _.getPageY(e);
            
            // 先不考虑移动方向，仅考虑右下方拖拽点
            let minLimit = 0;
            let styleInfo = operations.dealBR(itemInfo, moveX, moveY, minLimit);

            // 边界值处理
            itemInfo = operations.dealEdgeValue(itemInfo, styleInfo, container);

            dom.css(content.lastElementChild, {
                top: `${itemInfo.top}px`,
                left: `${itemInfo.left}px`,
                width: `${itemInfo.width}px`,
                height: `${itemInfo.height}px`
            });
        };

        function handleMouseUp() {
            let perInfo = {
                topPer: _.decimalPoint(itemInfo.top / container.height),
                leftPer: _.decimalPoint(itemInfo.left / container.width),
                widthPer: _.decimalPoint(itemInfo.width / container.width),
                heightPer: _.decimalPoint(itemInfo.height / container.height)
            };
            if(container.height < MIN_LIMIT && itemInfo.width > MIN_LIMIT) {
                self.changeItem(Object.assign(perInfo, {
                    topPer: 0,
                    heightPer: 1
                }));
                // 创建热区后默认弹出数据设置框
                self.setItem();
            } else if(itemInfo.width > MIN_LIMIT && itemInfo.height > MIN_LIMIT) {
                self.changeItem(perInfo);
                // 创建热区后默认弹出数据设置框
                self.setItem();
            } else {
                self.removeItem();
            }
            dom.off(window, 'mousemove', handleChange);
            dom.off(window, 'mouseup', handleMouseUp);
        };
    }

    return () => {
        dom.off(content, 'mousedown', handleMouseDown);
    };
}