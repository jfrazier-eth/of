const gulp = require('gulp');
const zip = require('gulp-zip');

exports.default = () => (
  gulp.src('ext-dist/**')
    .pipe(zip('only-agent.zip'))
    .pipe(gulp.dest('./'))
);
