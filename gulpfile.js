var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var debug = require('gulp-debug');
var browserify = require('gulp-browserify');

gulp.task('stage-bower-components', function () {
    return gulp.src(mainBowerFiles(), {base: '/home/ubuntu/workspace/bower_components'})
        .pipe(gulp.dest('js/vendor/'));
});

gulp.task('browserify-algebra', function () {
    return gulp.src('algebra/main.js')
        .pipe(browserify())
        .on('error', function (err) {
            console.log(err.message);
            this.end();
        })
        .pipe(gulp.dest('js/'));
});

gulp.task('watch-algebra', function () {
    gulp.watch('algebra/*.js', ['browserify-algebra']);
});