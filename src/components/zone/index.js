/**
 * Created by Aeo on 2017/5/23.
 */
import REGULAR from 'regularjs';
import template from './view.html';

import Modal from '../modal';
import Replicator from '../replicator';

import computed from './computed';
import filter from '../../assets/filter';
import directive from '../../assets/directive';
import * as Constant from '../../assets/constant';

const ZONE = REGULAR.extend({
    template,
    config(data) {
        if(data.setting && !data.setting.hasOwnProperty('target')) {
            data.setting.target = 1;
        }
        this.supr(data);
    },
    hideZone(isHide = true) {
        if(this.data.hideZone === isHide) {
            return;
        }
        this.data.hideZone = isHide;
        this.$update();
    },
    removeSpacing(isRemove = true) {
        if(this.data.removeSpacing === isRemove) {
            return;
        }
        this.data.removeSpacing = isRemove;
        this.$update();
    },
    adjustSpacing(info = {}, container = {}) {
        let { MIN_LIMIT, MIDDLE_TEXT_HEIGHT, BTN_VERTICAL_SPACING, BTN_HORIZONTAL_SPACING } = Constant;
        let smallHeight = MIN_LIMIT + BTN_VERTICAL_SPACING + MIDDLE_TEXT_HEIGHT;
        let smallWdith = MIN_LIMIT + BTN_HORIZONTAL_SPACING;
        if(container.height * info.heightPer <= smallHeight || container.width * info.widthPer <= smallWdith) {
            this.removeSpacing(true);
        } else {
            this.removeSpacing(false);
        }
    },
    stopPropagation(e) {
        e && e.stopPropagation();
    },
    setInfo(e) {
        this.stopPropagation(e);
        let { hasCallback, index, config } = this.data;
        let { link, target } = this.data.setting;
        if(hasCallback) {
            this.$emit('itemClick', index);
        } else {
            let modal = new Modal({
                data: {
                    link,
                    target,
                    config
                }
            });
            modal.$on('ok', (info) => {
                this.changeInfo(info);
            });
        }
    },
    /**
     * 链接设置和 directives 设置用
     * @param {Object} info
     */
    changeInfo(info = {}) {
        let { index } = this.data;
        this.$emit('changeInfo', {
            info,
            index
        });
    },
    delItem(e, index) {
        this.$emit('delItem', index);
    },
    copySuccess(text) {
        this.$emit('copySuccess', text);
    },
    copyError(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
        this.$emit('copyError', e);
    },
    notRange(row, col) {
        return row !== '100%' || col !== '100%';
    },
    // 强计算属性组件，抽取计算属性逻辑
    computed
})
.filter(filter)
.directive(directive)
.component('Replicator', Replicator);

// 将复制组件挂载方便外部拓展
ZONE.Replicator = Replicator;

export default ZONE;