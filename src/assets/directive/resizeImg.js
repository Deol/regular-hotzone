/**
 * 监听图片尺寸变化 directive
 * @param {Object} elem 
 */
import operations from '../operations';
import _ from '../util';

import elementResizeDetectorMaker from 'element-resize-detector';
const erd = elementResizeDetectorMaker();

export default function resizeImg(elem) {
    let self = this;

    erd.listenTo(elem, resize);

    function resize() {
        let container = _.getOffset(elem);
        let zones = self.data.zones || [];
        if(!zones.length) {
            return;
        }
        
        zones.forEach((item, index) => {
            let res = operations.limitMin(item, container);
            res && self.changeItem(res, index);
        });
    }

    return () => {
        erd.removeListener(elem, resize);
    };
};