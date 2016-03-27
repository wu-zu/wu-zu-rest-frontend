var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var browserSync = require('browser-sync').create();
var del = require('del');
var typescript = require('gulp-typescript');
var tscConfig = require('./tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');

gulp.task('tslint', function() {
  return gulp.src('app/*.ts')
    .pipe(tslint())
    .pipe(tslint().report('verbose'));
});

gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['index.html'])
    .pipe(gulp.dest('dest'));
});

gulp.task('clean', function() {
  return del('dist/**/*');
});

gulp.task('compile', ['clean'], function() {
  return gulp.src(tscConfig.files)
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js'
    ])
    .pipe(gulp.dest('dist/lib'))
});

gulp.task('uglify', function() {
  return gulp.src('app/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('minifycss', function() {
  return gulp.src('*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function() {
  gulp.watch(['app/*.js', '*.css'], ['uglify', 'minifycss']);
});

gulp.task('server', ['uglify', 'minify'], function() {
  return browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('default', ['tslint', 'compile', 'copy:libs', 'copy:assets', 'uglify', 'minifycss']);
gulp.task('dev', ['tslint', 'compile', 'copy:libs', 'copy:assets', 'uglify', 'minifycss', 'watch']);