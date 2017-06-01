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
    changeSetting(info = {}) {
        Object.assign(this.data.setting, info);
        this.$update();
    },
    hideInfo(isHide = true) {
        this.data.hideInfo = isHide;
        this.$update();
    },
    setInfo(e) {
        this.stopPropagation(e);
        let setting = this.data.setting;
        let modal = new Modal({
            data: {
                link: setting.link,
                target: setting.target
            }
        });
        modal.$on('ok', (info) => {
            Object.assign(setting, info);
            this.$update();
        });
    },
    delItem(e, index) {
        this.$emit('delItem', index);
    },
    checkLink(link) {
        window.open(link, '_blank');
    },
    // 强计算属性组件，抽取计算属性逻辑
    computed
})
.filter(filter)
.directive(directive);

export default ZONE;