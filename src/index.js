/**
 * Created by Aeo on 2017/5/22.
 * 热区组件，使用方式如下：
 * <HotZone
 *     image={image}
 *     zones={zones}
 *     isEdit={isEdit}
 *     on-change={this.change($event)}
 *     on-getInfo={this.getInfo($event)}
 *     on-itemClick={this.itemClick($event)}
 * ></HotZone>
 * image - 热区图片（必传）
 * zones - 热区数据（也可以利用内置方法 getInfo 进行热区数据获取）
 * isEdit - 标记当前该组件是否处于编辑状态（默认设置为编辑状态）
 * on-change - 当热区发生变化时触发
 * on-getInfo - 获取热区数据方法
 * on-itemClick - 当该方法存在时，不弹出 Modal，直接 emit 出选中热区的下标
 */
import './mcss/index.mcss';

import REGULAR from 'regularjs';
import template from './view.html';

import Zone from './components/zone';

import _ from './assets/util';
import directive from './assets/directive';

const HotZone = REGULAR.extend({
    template,
    config(data) {
        _.extend(data, {
            // 如果传入 itemClick 则该值为 true
            hasCallback: !!this._handles && !!this._handles.itemClick,
            isEdit: true,
            zones: []
        });
        this.supr(data);
    },
    changeInfo(res) {
        let {info, index} = res;
        this.changeItem(info, index);
    },
    addItem(setting = {}) {
        this.data.zones.push(setting);
        this.hasChange();
    },
    removeItem(index = this.data.zones.length - 1) {
        this.data.zones.splice(index, 1);
        this.hasChange();
    },
    changeItem(info = {}, index = this.data.zones.length - 1) {
        Object.assign(this.data.zones[index], info);
        this.hasChange();
    },
    hasChange() {
        this.$emit('change', this.data.zones);
        this.$update();
    },
    itemClick(index) {
        this.$emit('itemClick', index);
    },
    getInfo() {
        return this.data.zones;
    }
}).directive(directive);

HotZone.component('Zone', Zone);

module.exports = HotZone;
