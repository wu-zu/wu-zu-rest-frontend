var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var superstatic = require('superstatic');
var del = require('del');
var typescript = require('gulp-typescript');
var tscConfig = require('./tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');

gulp.task('tslint', function() {
  return gulp.src('app/ts/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('vervose'));
});

gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/index.html'])
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return del('dist/**/*');
});

gulp.task('compile', ['clean'], function() {
  return gulp.src('app/ts/*.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/js'));
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
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('app/js'));
});

gulp.task('uglify', function() {
  return gulp.src('app/*.js')
    .pipe(concat('service.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('minifycss', function() {
  return gulp.src('app/css/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('server', function() {
  gulp.watch(['app/ts/*.ts'], ['tslint', 'compile']);

  browserSync({
    port: 3000,
    file: ['app/index.html', 'app/js/main.js'],
    ingectChanges: true,
    logFileChanges: false,
    logLevel: 'silent',
    norify: true,
    reloadDelay: 0,
    server: {
      baseDir: 'app',
      middleware: superstatic({debug: false})
    }
  });
});

gulp.task('dev', ['copy:libs', 'server']);
gulp.task('build', ['tslint', 'compile', 'copy:libs', 'copy:assets']);