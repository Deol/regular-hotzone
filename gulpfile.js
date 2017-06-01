var gulp = require('gulp');
var del = require('del');

// 删除 dist 文件
gulp.task('clean', function () {
    del.sync('dist/', {force: true});
})