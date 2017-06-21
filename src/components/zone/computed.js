/**
 * 将小数转换为百分比字符串
 * @param {Number} val 
 */
function getZoneStyle(val) {
    return `${(val || 0) * 100}%`;
}
/**
 * 通过热区的 topPer && leftPer 值决定 hover 信息的 top && left 值
 * @param {Number} pos 
 * @param {Number} size 
 */
function getInfoBefore(posPer, sizePer) {
    if(sizePer > 0.5) {
        return '50%';
    }
    if(posPer + sizePer / 2 < 0.5) {
        return '100%';
    }
    return 'initial';
}
/**
 * 通过热区的 bottom && right 值决定 hover 信息的 bottom && right 值
 * @param {Number} pos 
 * @param {Number} size 
 */
function getInfoAfter(posPer, sizePer) {
    if(sizePer < 0.5 && posPer + sizePer / 2 > 0.5) {
        return '100%';
    }
    return 'initial';
}

export default {
    // 热区位置数据
    zoneTop() {
        return getZoneStyle(this.data.setting.topPer);
    },
    zoneLeft() {
        return getZoneStyle(this.data.setting.leftPer);
    },
    zoneWidth() {
        return getZoneStyle(this.data.setting.widthPer);
    },
    zoneHeight() {
        return getZoneStyle(this.data.setting.heightPer);
    },
    
    // 热区 hover 信息位置及 transform 数据
    infoTop() {
        let {topPer, heightPer} = this.data.setting;
        return getInfoBefore(topPer, heightPer);
    },
    infoLeft() {
        let {leftPer, widthPer} = this.data.setting;
        return getInfoBefore(leftPer, widthPer);
    },
    infoBottom() {
        let {topPer, heightPer} = this.data.setting;
        return getInfoAfter(topPer, heightPer);
    },
    infoRight() {
        let {leftPer, widthPer} = this.data.setting;
        return getInfoAfter(leftPer, widthPer);
    },
    infoTransform() {
        let setting = this.data.setting;
        return `translate(${setting.widthPer > 0.5 ? -50 : 0}%, ${setting.heightPer > 0.5 ? -50 : 0}%)`;
    },

    // 拉取新热区时，拖拽点全部不显示
    tooSmall() {
        let setting = this.data.setting;
        return setting.widthPer < 0.01 && setting.heightPer < 0.01;
    }
};