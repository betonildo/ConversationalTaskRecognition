var gulp          = require('gulp');
var browserSync   = require('browser-sync').create();
var webpack       = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('dist/*js')
        .pipe(webpack( webpackConfig ))
        .pipe(gulp.dest(''));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('ts-watch', ['js'], function (done) {
    webpack( webpackConfig );
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['js'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(["src/*.ts*", "src/**/*.ts*"], ['ts-watch']);
});