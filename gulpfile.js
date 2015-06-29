var del = require('del');
var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');

gulp.task('lint', function () {
  gulp.src('srv/bnd.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function(cb) {
  del(['dist/*'], cb);
});

gulp.task('transpile', ['clean'], function() {
  return gulp.src('src/bnd.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('uglify', ['transpile'], function() {
  return gulp.src('dist/bnd.js')
    .pipe(uglify())
    .pipe(rename('bnd.min.js'))
    .pipe(gulp.dest('dist'));
});
 
gulp.task('default', ['lint', 'uglify']);
