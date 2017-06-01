let gulp = require('gulp');
let del = require('del');

// 删除 dist 文件
gulp.task('clean', () => {
    del.sync('dist/', {force: true});
});