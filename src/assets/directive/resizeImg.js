/**
 * 监听图片尺寸变化 directive
 * @param {Object} elem 
 */
import operations from '../operations';
import * as Constant from '../constant';
import _ from '../util';

const MIN_LIMIT = Constant.MIN_LIMIT;

import elementResizeDetectorMaker from 'element-resize-detector';
const erd = elementResizeDetectorMaker();

export default function resizeImg(elem) {
    let self = this;

    const resize = _.debounce(() => {
        let container = _.getOffset(elem);
        let zones = self.data.zones || [];
        if(!zones.length || !container.height || !container.width ||
            container.height < MIN_LIMIT || container.width < MIN_LIMIT) {
            return;
        }

        zones.forEach((item, index) => {
            let res = operations.limitMin(item, container);
            res && self.changeItem(res, index);
        });
    }, 500);

    erd.listenTo(elem, resize);

    return () => {
        erd.removeListener(elem, resize);
    };
};