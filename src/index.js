/**
 * Created by Aeo on 2017/5/22.
 * 热区组件，使用方式如下：
 * <HotZone
 *     image={image}
 *     zones={zones}
 *     isEdit={isEdit}
 *     config={config}
 *     on-add={this.add($event)}
 *     on-erase={this.erase($event)}
 *     on-change={this.change($event)}
 *     on-remove={this.remove($event)}
 *     on-overRange={this.overRange($event)}
 *     on-itemClick={this.itemClick($event)}
 *     on-copyError={this.copyError($event)}
 *     on-copySuccess={this.copySuccess($event)}
 * ></HotZone>
 * image - 热区图片（必传）
 * zones - 热区数据（也可以利用内置方法 getInfo 进行热区数据获取）
 * isEdit - 标记当前该组件是否处于编辑状态（默认设置为编辑状态）
 * config {
 *     maxNum - 最多支持的热区数量
 *     pattern - 链接的正则校验规则
 *     showCopy - 是否显示复制按钮（默认为 false）
 * } - 配置信息
 * on-add - 添加一个热区之后触发
 * on-erase - 当拖拽生成的区域小于设定的边界值，不生成该区域
 * on-change - 当热区发生变化时触发
 * on-remove - 删除一个热区之后触发
 * on-overRange - 当达到最大热区数量时，不生成该热区
 * on-itemClick - 当该方法存在时，不弹出 Modal，直接 emit 出选中热区的下标
 * on-copySuccess - 当展示复制功能时且复制成功时触发
 * on-copyError - 当展示复制功能时且复制失败时触发
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
    isOverRange() {
        let { config = {}, zones = [] } = this.data;
        return config.hasOwnProperty('maxNum') && zones.length > config.maxNum;
    },
    overRange(index = this.data.zones.length - 1) {
        this.$emit('overRange', index);
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
        // 如果宽度和高度都被变更了，则检查是否需要调整热区按钮间隔大小
        if(info.hasOwnProperty('heightPer') && info.hasOwnProperty('widthPer')) {
            let container = _.getOffset(this.$refs.content);
            this.$refs[`zone_${index}`].adjustSpacing(info, container);
        }
        this.hasChange();
    },
    hasChange() {
        this.$emit('change', this.data.zones);
        this.$update();
    },
    itemClick(index) {
        this.$emit('itemClick', index);
    },
    copySuccess(text) {
        this.$emit('copySuccess', text);
    },
    copyError(e) {
        this.$emit('copyError', e);
    },
    getInfo() {
        return this.data.zones;
    }
}).directive(directive);

HotZone.component('Zone', Zone);

// 将热区信息组件挂载方便外部拓展
HotZone.Zone = Zone;

module.exports = HotZone;
