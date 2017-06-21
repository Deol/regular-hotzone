/**
 * 拖拽元素 directive
 * @param {Object} elem 
 */
import { dom } from 'regularjs';
import _ from '../util';

export default function dragItem(elem) {
    let self = this;

    dom.on(elem, 'mousedown', handleMouseDown);

    function handleMouseDown(e) {
        e && e.stopPropagation();

        let container = _.getOffset(elem.parentNode);
        let preX = _.getPageX(e);
        let preY = _.getPageY(e);
        let topPer, leftPer, flag;

        // 隐藏 hover 显示的信息
        self.hideZone(true);

        dom.on(window, 'mousemove', handleChange);
        dom.on(window, 'mouseup', handleMouseUp);

        function handleChange(e) {
            e && e.preventDefault();
            flag = true;

            let setting = self.data.setting;
            let moveX = _.getPageX(e) - preX;
            let moveY = _.getPageY(e) - preY;
            
            setting.topPer = setting.topPer || 0;
            setting.leftPer = setting.leftPer || 0;
            topPer = _.decimalPoint(moveY / container.height + setting.topPer);
            leftPer = _.decimalPoint(moveX / container.width + setting.leftPer);

            // 热区块移动边界处理
            if(topPer < 0) {
                topPer = 0;
                moveY = -container.height * setting.topPer;
            }
            if(leftPer < 0) {
                leftPer = 0;
                moveX = -container.width * setting.leftPer;
            }
            if(topPer + setting.heightPer > 1) {
                topPer = 1 - setting.heightPer;
                moveY = container.height * (topPer - setting.topPer);
            }
            if(leftPer + setting.widthPer > 1) {
                leftPer = 1 - setting.widthPer;
                moveX = container.width * (leftPer - setting.leftPer);
            }
            
            dom.css(elem, { transform: `translate(${moveX}px, ${moveY}px)` });
        };

        function handleMouseUp() {
            if(flag) {
                flag = false;
                dom.css(elem, { transform: 'translate(0, 0)' });
                self.changeInfo({
                    topPer,
                    leftPer
                });
            }
            // 显示 hover 显示的信息
            self.hideZone(false);

            dom.off(window, 'mousemove', handleChange);
            dom.off(window, 'mouseup', handleMouseUp);
        };
    }

    return () => {
        dom.off(elem, 'mousedown', handleMouseDown);
    };
}