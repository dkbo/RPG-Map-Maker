var gulp = require('gulp'),      
    jshint = require('gulp-jshint'),        
    imagemin = require('gulp-imagemin'),    //圖片壓縮用
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),        //合並用       
    notify = require('gulp-notify'),        //通知用
    cache = require('gulp-cache'),          
    livereload = require('gulp-livereload'),//即時更新
    del = require('del'),
    watch = require('gulp-watch'),                   //刪除   
    uglify = require('gulp-uglify'),       //JS最簡壓縮用
    webserver = require('gulp-webserver'), //內建伺服器用
    jade = require('gulp-jade'),           //html 用 
    compass = require('gulp-compass'),     //compass sass+ susy
    react = require('gulp-babel');       //babel
var init = {
  jade : {
    name : 'jade',
    src : 'app/jade/**/*.jade',
    message : 'html task ok',
    dest : ''
  },
  react : {
    name : 'react',
    src : 'app/react/**/*.jsx',
    concat : 'js/all.jsx',
    message : 'Reactjs task ok',
    dest : ''
  },
  compass : {
    name : 'compass',
    src : 'app/sass/**/*.sass',
    config_file: 'app/sass/config.rb',
    css: '',
    sass: 'app/sass',
    sourcemap: true,
    style: 'compressed',
    comments: false,
    require: ['susy'],
    message : 'css task ok'
  },
  webServer : {
    name : 'webserver',
    src : '',
    port : 80,
    livereload : true
  },

}
gulp.task(init.webServer.name, function() {
  var x = init.webServer;
  gulp.src(x.src)
    .pipe(webserver({
         port: x.port, 
         livereload: x.livereload,
    }));
});
gulp.task(init.jade.name, function() {
  var x = init.jade;
  gulp.src(x.src)
     .pipe(jade())
     .pipe(gulp.dest(x.dest))
     .pipe(notify({ message: x.message }))
     .pipe(livereload());
});
gulp.task(init.react.name, function() {
    var x = init.react
    gulp.src(x.src) 
    .pipe(concat(x.concat))
    .pipe(react()) 
    .pipe(uglify())
    .pipe(gulp.dest(x.dest))
    .pipe(notify({ message: x.message }))
    .pipe(livereload());
});
gulp.task(init.compass.name, function() {
  var x = init.compass;
    gulp.src(x.src)
    .pipe(compass({
    config_file: x.config_file,
    css: x.css,
    sass: x.sass,
    sourcemap: x.sourcemap,
    style: x.style,
    comments: x.comments,
    require: x.require
  }))
  .pipe(notify({ message: x.message }))
  .pipe(livereload());
  gulp.run('del');
});
gulp.task('del', function(cb) {
    del([
        '.sass-cache'
    ], cb)
});
gulp.task('watch', function () { 
  gulp.watch('app/jade/**/*.jade', ['jade']);
  gulp.watch('app/sass/**/*.sass', ['compass']);
  gulp.watch('app/coffeescripts/**/*.coffee', ['coffee']);
  gulp.watch('app/react/**/*.jsx', ['react']);
  gulp.watch('app/images/**/*', ['images']);
  livereload.listen();
});
 // Default task
gulp.task('default', ['jade','compass','react','webserver','watch'])

