/**
 * 监听图片尺寸变化 directive
 * @param {Object} elem 
 */
import { dom } from 'regularjs';
import * as Constant from '../constant';
import _ from '../util';

// 热区块的最小大小限制
const MIN_LIMIT = Constant.MIN_LIMIT;

export default function changeSize(elem) {
    let self = this;

    // 屏幕大小发生变化时保持最小尺寸
    let preContainer;

    dom.on(window, 'resize', resizeImg);    

    function resizeImg() {
        console.log('resize');
        if(!elem || !elem.parentNode) {
            return;
        }
        
        let setting = self.data.setting;
        let zone = _.getOffset(elem);
        let container = _.getOffset(elem.parentNode);

        if(preContainer && container.width === preContainer.width) {
            return;
        }
        preContainer = container;

        if(zone.height < MIN_LIMIT) {
            self.changeInfo({
                heightPer: _.decimalPoint(MIN_LIMIT / container.height)
            });
        }
        if(zone.width < MIN_LIMIT) {
            self.changeInfo({
                widthPer: _.decimalPoint(MIN_LIMIT / container.width)
            });
        }
        if(setting.topPer + setting.heightPer > 1) {
            self.changeInfo({
                topPer: 1 - setting.heightPer
            });
        }
        if(setting.leftPer + setting.widthPer > 1) {
            self.changeInfo({
                leftPer: 1 - setting.widthPer
            });
        }
    };

    return () => {
        dom.off(window, 'resize', resizeImg);
    };
};