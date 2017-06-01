/**
 * Created by Aeo on 2017/5/22.
 * 热区组件，使用方式如下：
 * <HotZone image={image} zones={zones} isEdit={isEdit} on-getInfo={this.getInfo($event)}></HotZone>
 * image - 热区图片
 * zones - 热区数据
 * isEdit - 标记当前该组件是否处于编辑状态
 * on-getInfo - 获取热区数据方法
 */
import './mcss/index.mcss';

import REGULAR from 'regularjs';
import template from './view.html';

import Zone from './components/zone';

import directive from './assets/directive';

const HotZone = REGULAR.extend({
    template,
    addItem(setting = {}) {
        this.data.zones.push(setting);
        this.$update();
    },
    removeItem(index = this.data.zones.length - 1) {
        this.data.zones.splice(index, 1);
        this.$update();
    },
    changeItem(info = {}, index = this.data.zones.length - 1) {
        Object.assign(this.data.zones[index], info);
        this.$update();
    },
    getInfo() {
        return this.data.zones;
    }
}).directive(directive);

HotZone.component('Zone', Zone);

export default HotZone;