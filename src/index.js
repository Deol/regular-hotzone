/**
 * Created by Aeo on 2017/5/22.
 * 热区组件，使用方式如下：
 * <HotZone
 *     image={image}
 *     zones={zones}
 *     isEdit={isEdit}
 *     config={config}
 *     on-erase={this.erase($event)}
 *     on-change={this.change($event)}
 *     on-getInfo={this.getInfo($event)}
 *     on-itemClick={this.itemClick($event)}
 * ></HotZone>
 * image - 热区图片（必传）
 * zones - 热区数据（也可以利用内置方法 getInfo 进行热区数据获取）
 * isEdit - 标记当前该组件是否处于编辑状态（默认设置为编辑状态）
 * config {
 *     pattern - 链接的正则校验规则
 * } - 配置信息
 * on-erase - 当拖拽生成的区域小于设定的边界值，不生成该区域
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
            config: {},
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
        this.$emit('add', setting);
        this.hasChange();
    },
    eraseItem(index = this.data.zones.length - 1) {
        this.$emit('erase', index);
        this.removeItem(index);
    },
    removeItem(index = this.data.zones.length - 1) {
        this.data.zones.splice(index, 1);
        this.$emit('remove', index);
        this.hasChange();
    },
    setItem(index = this.data.zones.length - 1) {
        this.$refs[`zone_${index}`].setInfo();
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

// 将热区信息组件挂载方便外部拓展
HotZone.Zone = Zone;

module.exports = HotZone;
