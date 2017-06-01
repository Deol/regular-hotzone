/**
 * 自动聚焦元素 directive
 * @param {Object} elem
 */
export default function autoFocus(elem) {
    setTimeout(() => {
        elem.focus();
    }, 0);
}