var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var debug = require('gulp-debug');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var markdown = require('gulp-markdown');
var rename = require('gulp-rename');

var miniprojects = ['algebra', 'gridworld'];

gulp.task('stage-bower-components', function () {
    return gulp.src(mainBowerFiles(), {base: '/home/ubuntu/workspace/bower_components'})
        .pipe(rename(function (p) {
           p.dirname = p.dirname.replace(/\/build$/, '');   // Hack for phaser
        }))
        .pipe(gulp.dest('js/vendor/'));
});

gulp.task('vendor-js-dist', function () {
    return gulp.src('js/vendor/**')
        .pipe(gulp.dest('site/js/vendor/'));
});

function meta_task(key) {
    
    gulp.task('browserify-' + key, function () {
        return gulp.src( key + '/main.js')
            .pipe(browserify())
            .on('error', function (err) {
                console.log(err.message);
                this.end();
            })
            .pipe(gulp.dest('js/' + key + '/'));
    });
    
    gulp.task(key + '-js-dist', function () {
        return gulp.src( key + '/main.js')
            .pipe(browserify())
            .on('error', function (err) {
                console.log(err.message);
                this.end();
            })
            .pipe(uglify())
            .pipe(gulp.dest('site/js/' + key + '/'));
    });
    
    gulp.task(key + '-html-dist', function () {
        return gulp.src([key + '.html', key + '.css'])
            .pipe(gulp.dest('site/'));
    });
    
    gulp.task('build-' + key, ['vendor-js-dist',
        key + '-js-dist', key + '-html-dist']); 
    
    gulp.task('watch-' + key, function () {
        gulp.watch(key + '/*.js', ['browserify-' + key]);
    });
}

for (var i=0, l = miniprojects.length; i<l; i++) {
    meta_task(miniprojects[i]);
}