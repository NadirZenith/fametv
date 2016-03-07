//global
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

//styles
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

//scripts
var browserify = require('browserify');
var aliasify = require('aliasify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');//see: http://stackoverflow.com/questions/24992980/how-to-uglify-output-with-browserify-in-gulp
var uglify = require('gulp-uglify');

var path = {
    dist: 'dist/',
    node_modules: 'node_modules/'
};

gulp.task('styles', function () {
    gulp.src([
        'src/less/main.less'
    ])
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(minifyCSS())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.dist));
});

gulp.task('modules', function () {
    gulp.src([
        /*'node_modules/jquery/dist/jquery.min.js',*/
        /*'node_modules/jquery.easing/jquery.easing.min.js',*/
        /*'node_modules/bootstrap/dist/js/bootstrap.min.js',*/
    ])
            .pipe(sourcemaps.init())
            .pipe(concat('modules.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.dist));

});

gulp.task('app', function () {
    /*
     require('dotenv').config();
     var env = (process.env.DEBUG) ? 'DEV' : '';
     aliasifyConfig = {
     aliases: {
     "config": "./src/js/config" + env + ".js"
     },
     verbose: false
     };
     */
            /*.transform(aliasify, aliasifyConfig)*/
    /*.transform({global: true}, aliasify) //see: https://gist.github.com/malte-wessel/8a295bc604c4a0d0dbe1 */

/*
    var bundler = browserify({
        entries: ['src/js/main.js'],
        debug: true,
        paths: ['./node_modules']
    });
    bundler
            .bundle()
            .pipe(source('build.min.js'))
            .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
 */
    
    var bundler = browserify({
        entries: ['src/js/main.js'],
        debug: true,
        paths: ['./node_modules']
    });
    bundler
            .bundle()
            .pipe(source('build.js'))
            .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
            .pipe(sourcemaps.init({loadMaps: true}))
            /*.pipe(uglify())*/
            .pipe(sourcemaps.write())
            /*.pipe(sourcemaps.write('./'))*/
            .pipe(gulp.dest('./dist'));
});

gulp.task('default', function () {
    gulp.run('modules', 'styles', 'app');

    gulp.watch('src/js/**', function (event) {
        gulp.run('app');
    });

    gulp.watch('src/less/**', function (event) {
        gulp.run('styles');
    });

});