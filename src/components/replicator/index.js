/**
 * Created by Froguard.
 */
import REGUILAR from 'regularjs';
import template from './view.html';

import Clipboard from 'clipboard';

let getEle = document.getElementById.bind(document);
const allowCLPBD = window.clipboardData && window.clipboardData.setData;
function genId(id, defaultDomId = `j-rand-${(Math.random() * 100).toFixed(0)}`) {
    if(typeof id !== 'string' || id === '') {
        id = defaultDomId;
    }
    while (getEle(id) !== null) {
        id = `${defaultDomId}-${(Math.random() * 100).toFixed(0)}`;
    }
    return id;
}

/**
 *   import Replicator from 'regular-hotzone/src/components/replicator';
 *
 * 使用方式1：
 *
 *   let clip = new Replicator();
 *   clip.$on('success', () => {
 *       console.log('success');
 *   });
 *   clip.$on('error', e => {
 *       console.log('error', e);
 *   });
 *   document.getElementById('btnXXX').addEventListener('click', event => clip.copy('需要拷贝的文字内容', event), false);
 *   // clip.copy('asdafasdsa');// 不推荐！
 *
 *  使用方式2（推荐）：在regular中，由于$event被封装过，如果要拿到原始的event，需要 $event.event才是最原始的event
 *
 *  App.use('copy', Replicator);
 *
 *  在template.html中:
 *  <copy class="u-btn" copyText={needCopyStr} on-success={this.ok($event)} on-error={this.error($event)}>复制文字</copy>
 *
 *  在App.js中:
 *  {
 *      config(data){
 *          this.data.needCopyStr = 'hello world';
 *      }
 *      ok(text){
 *          // ...
 *      },
 *      error(e){
 *          // ...
 *      }
 *  }
 */
let Replicator = REGUILAR.extend({
    // name: 'Replicator',
    template,
    config(data) {
        Object.assign({
            btnText: '复制',
            copyText: '',
            mustDoCopy: true
        }, data);
        data.id = genId('', 'j-replicator');
        if(data.isolate) {
            console.log('%cIt will be copied just one time with param "isolate"', 'color:#5C3B00;background-color:#FFFBE6;');
        }
        this.supr(data);
    },
    _initClipboard() {
        if(Clipboard.isSupported()) {
            let self = this;
            // 初始化 复制到剪切板 功能
            this.clipboard = new Clipboard(`#${this.data.id}>input[data-for-copy]`, {
                text() {
                    return self.data.copyText;
                }
            });
            this.clipboard.on('success', () => {
                this.$emit('success', this.data.copyText);
            });
            this.clipboard.on('error', (e) => {
                this.$emit('error', e);
                this.data.mustDoCopy && this._mustDoCopy();
            });
        } else {
            this.clipboard = null;
            console.log('%c抱歉，您当前所用的浏览器暂时不支持clipboard插件', 'color:#5C3B00;background-color:#FFFBE6;');
        }
        this.$update();
    },
    init() {
        this.supr();
        // destroy clipboard
        this.$on('$destroy', () => {
            this.clipboard && this.clipboard.destroy();
        });
        if(this.$root === this) {
            this.data.visible = false;
            // init clipboard after inject
            this.$on('inject', () => this._initClipboard());
            // 如果不是内嵌组件，则嵌入到document.body中
            this.$inject(document.body);
        } else {
            this.data.visible = true;
            this._initClipboard();
        }
    },
    _onClick($event) {
        this.copy(this.data.copyText, $event.event);
    },
    /**
     * copy
     * @param text  需要copy的内容
     * @param event event实例，如果是 regular 的 $event,请通过 $event.event 获取
     */
    copy(text = this.data.copyText, event = false) {
        if(event) {
            try {
                this._normalCopy(text, event);
            } catch (e) {
                this._otherCopy(text);
            }
        } else {
            console.warn('%cParam "event" should be passed in!', 'color:#5C3B00;background-color:#FFFBE6;');
            this._otherCopy(text);
        }
    },
    // 借助clipboard插件的常规拷贝
    _normalCopy(text = this.data.copyText, event) {
        this.data.copyText = text;
        this.$update();
        this.clipboard && this.clipboard.onClick(event);
    },
    // 另一种copy方式
    _otherCopy(text = this.data.copyText) {
        this.data.copyText = text;
        this.$update();
        let $inp = this.$refs.input;
        try {
            if(allowCLPBD) {
                window.clipboardData.setData('text', text);
            } else {
                $inp.select();
                document.execCommand('copy');
            }
            this.$emit('success', text);
        } catch (e) {
            console.warn(e);
            this.$emit('error', e);
            this.data.mustDoCopy && this._mustDoCopy(text);
        }
    },
    _mustDoCopy(text = this.data.copyText) {
        window.prompt('Copy to clipboard:(Ctrl+C)', text); // eslint-disable-line
    }
});

export default Replicator;