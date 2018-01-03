/**
 * Created by Aeo on 2017/5/23.
 */
import REGULAR from 'regularjs';
import template from './view.html';

import Modal from '../modal';
import Replicator from '../replicator';

import _ from '../../assets/util';
import computed from './computed';
import filter from '../../assets/filter';
import directive from '../../assets/directive';
import operations from '../../assets/operations';
import * as Constant from '../../assets/constant';

const ZONE = REGULAR.extend({
    template,
    config(data) {
        if(data.setting && !data.setting.hasOwnProperty('target')) {
            data.setting.target = 1;
        }
        this.supr(data);
        this.$watch(['setting.heightPer', 'setting.widthPer'], (newVal) => {
            newVal && setTimeout(() => {
                let container = _.getOffset(this.$parent.$refs.content);
                this.checkSize(data.setting, container);
            }, 0);
        });
    },
    checkSize(info = {}, container = {}) {
        let { MIN_LIMIT, MIDDLE_TEXT_HEIGHT, BTN_VERTICAL_SPACING, BTN_HORIZONTAL_SPACING } = Constant;
        let smallHeight = MIN_LIMIT + BTN_VERTICAL_SPACING + MIDDLE_TEXT_HEIGHT;
        let smallWdith = MIN_LIMIT + BTN_HORIZONTAL_SPACING;

        // 修改按钮样式，小于最小限制时隐藏文字，并去除按钮间距和边框
        if (container.height * info.heightPer <= smallHeight ||
            container.width * info.widthPer <= smallWdith) {
            this.removeSpacing(true);
        } else {
            this.removeSpacing(false);
        }

        // 新宽高的尺寸限制处理
        if(!container.height || !container.width ||
            container.height < MIN_LIMIT || container.width < MIN_LIMIT) {
            return;
        }
        let res = operations.limitMin(info, container);
        if(res) {
            Object.assign(this.data.setting, res);
            this.changeInfo(res);
            this.$update();
        }
    },
    removeSpacing(isRemove = true) {
        if(this.data.removeSpacing === isRemove) {
            return;
        }
        this.data.removeSpacing = isRemove;
        this.$update();
    },
    hideZone(isHide = true) {
        if(this.data.hideZone === isHide) {
            return;
        }
        this.data.hideZone = isHide;
        this.$update();
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