
import REGUILAR from 'regularjs';
import template from './view.html';

import _ from '../../assets/util';
import filter from '../../assets/filter';
import directive from '../../assets/directive';

let Modal = REGUILAR.extend({
    name: 'modal',
    template,
    checkUrl: _.checkUrl,
    config(data) {
        _.extend(data, {
            link: 'https://',
            isUrl: true,
            config: {}
        });
        this.supr(data);
    },
    init() {
        this.supr();

        // 如果不是内嵌组件，则嵌入到 document.body 中
        if(this.$root === this) {
            this.$inject(document.body);
        }
    },
    removeTip() {
        this.data.isUrl = true;
    },
    handleKeyDown(e, link, target) {
        if (e.keyCode === 13 || e.which === 13) {
            e && e.preventDefault();
            this.$refs.link.blur();
            this.ok(link, target);
        }
        if (e.keyCode === 27 || e.which === 27) {
            this.cancel();
        }
    },
    ok(link, target) {
        this.data.isUrl = this.checkUrl(link, this.data.config.pattern);
        if(!this.data.isUrl) {
            return;
        }
        this.$emit('ok', {link, target});
        this.destroy();
    },
    cancel() {
        this.$emit('cancel');
        this.destroy();
    }
})
.filter(filter)
.directive(directive);

export default Modal;
