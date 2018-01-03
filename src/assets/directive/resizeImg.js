/**
 * 监听图片尺寸变化 directive
 * @param {Object} elem
 */
import * as Constant from '../constant';
import _ from '../util';

const MIN_LIMIT = Constant.MIN_LIMIT;

import elementResizeDetectorMaker from 'element-resize-detector';
const erd = elementResizeDetectorMaker();

export default function resizeImg(elem) {

    const resize = _.debounce(() => {
        let container = _.getOffset(elem);
        let zones = this.data.zones || [];
        if(!zones.length || !container.height || !container.width ||
            container.height < MIN_LIMIT || container.width < MIN_LIMIT) {
            return;
        }
        zones.forEach((item, index) => this.$refs[`zone_${index}`].checkSize(item, container));
    }, 500);

    erd.listenTo(elem, resize);

    return () => {
        erd.removeListener(elem, resize);
    };
};