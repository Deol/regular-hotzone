/**
 * Created by Aeo on 2017/5/23.
 */
import REGULAR from 'regularjs';
import template from './view.html';

import Modal from '../modal';

import computed from './computed';
import filter from '../../assets/filter';
import directive from '../../assets/directive';

const ZONE = REGULAR.extend({
    template,
    config(data) {
        if(data.setting && !data.setting.hasOwnProperty('target')) {
            data.setting.target = 1;
        }
        this.supr(data);
    },
    stopPropagation(e) {
        e && e.stopPropagation();
    },
    hideZone(isHide = true) {
        this.data.hideZone = isHide;
        this.$update();
    },
    setInfo(e) {
        this.stopPropagation(e);
        let { hasCallback, index } = this.data;
        let { link, target } = this.data.setting;
        if(hasCallback) {
            this.$emit('itemClick', index);
        } else {
            let modal = new Modal({
                data: {
                    link,
                    target
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
    checkLink(link, target) {
        if(target) {
            window.open(link, '_blank');
        } else {
            window.location.href = link;
        }
    },
    // 强计算属性组件，抽取计算属性逻辑
    computed
})
.filter(filter)
.directive(directive);

export default ZONE;