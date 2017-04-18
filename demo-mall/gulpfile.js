var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    del = require('del');

var isDebug = true;//isDebug=false时候是使用压缩文件的
var buildDirname = './../build/' + __dirname.split('\\').pop();

//压缩 framework css
gulp.task('framework_minify_css', function () {
    var cssSrc = [
            './../framework/*.css','./../framework/*.scss',
            './../framework/*/*.css','./../framework/*/*.scss'
        ];

    del(buildDirname + '/framework.css');
    del(buildDirname + '/framework.min.css');
    return gulp.src(cssSrc)      //压缩的文件
        .pipe(sass())
        .pipe(concat('framework.css'))    //合并所有css到all.css
        .pipe(gulp.dest(buildDirname))   //输出文件夹
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(buildDirname)); //执行压缩
});
//压缩 demo css
gulp.task('demo_minify_css', function () {
    var cssSrc = [
            './*.css','./*.scss',
            './*/*.css','./*/*.scss',
            './*/*/*.css','./*/*/*.scss',
            './*/*/*/*.css','./*/*/*/*.scss',
            './*/*/*/*/*.css','./*/*/*/*/*.scss'
        ];

    del(buildDirname + '/demo.css');
    del(buildDirname + '/demo.min.css');
    return gulp.src(cssSrc) //压缩的文件
        .pipe(sass())
        .pipe(concat('demo.css'))    //合并所有css到all.css
        .pipe(gulp.dest(buildDirname))   //输出文件夹
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(buildDirname)); //执行压缩
});

//压缩 framework js
gulp.task('framework_minify_js', function() {
    var jsSrc = [
            './../framework/*.js','./../framework/*/*.js'
        ];

    del(buildDirname + '/framework.js');
    del(buildDirname + '/framework.min.js');
    return gulp.src(jsSrc)
        .pipe(concat('framework.js'))    //合并所有js到framework.js
        .pipe(gulp.dest(buildDirname))    //输出framework.js到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest(buildDirname));  //输出
});

//压缩 demo js
gulp.task('demo_minify_js', function() {
    var jsSrc = [
            './*.js','./*/*.js','./*/*/*.js','./*/*/*/*.js','./*/*/*/*/*.js','!gulpfile.js'//app
        ];

    del(buildDirname + '/demo.js');
    del(buildDirname + '/demo.min.js');
    return gulp.src(jsSrc)
        .pipe(concat('demo.js'))    //合并所有js到demo.js
        .pipe(gulp.dest(buildDirname))    //输出demo.js到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest(buildDirname));  //输出
});

//复制新的html
gulp.task('copy_html',function() {
    var version = Date.now();
    del(buildDirname + '/index.html');
    return gulp.src('./index.template',{ base: '.' })
        .pipe(rename("index.html"))
        .pipe(replace(/\.css/g, isDebug?'.css':('.min.css?t='+version)))
        .pipe(replace(/\.js/g, isDebug?'.js':('.min.js?t='+version)))
        .pipe(gulp.dest(buildDirname));
  });


// 默认任务
gulp.task('default', function(){
    gulp.run('framework_minify_css','demo_minify_css', 'framework_minify_js', 'demo_minify_js','copy_html');
});