var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var es = require('event-stream');
var ghPages = require('gulp-gh-pages');


var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * <%= pkg.author %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n'
};


gulp.task('default', ['build']);
gulp.task('build', ['scripts']);
gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*.{js,html}'], ['build']);
});
gulp.task('clean:uform', function() {
  return del.sync('dist');
});

var gulp = require('gulp');


gulp.task('deploy', function() {
  return gulp.src('./demo/**/*')
    .pipe(ghPages());
});

gulp.task('scripts', ['clean:uform'], function () {
    var buildTemplates = function() {
        return gulp.src('src/templates/*.html')
            .pipe($.minifyHtml({
                empty: true,
                spare: true,
                quote: true
            }))
            .pipe($.angularTemplatecache({module: 'up.uform'}))
    };
    var buildLib = function() {
        return gulp.src(['src/common.js', 'src/*.js'])
            .pipe($.plumber({
                errorHandler: handleError
            }))
            .pipe($.ngAnnotate())
            .pipe($.concat('uform_without_templates.js'))
            .pipe($.header('(function() { \n"use strict";\n'))
            .pipe($.footer('\n}());'))
    };
    return es.merge(buildLib(), buildTemplates())
        .pipe($.plumber({
             errorHandler: handleError
        }))
        .pipe($.concat('uform.js'))
        .pipe($.header(config.banner, {
            timestamp: (new Date()).toISOString(), pkg: config.pkg
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.sourcemaps.init())
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.concat('uform.min.js'))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});
var handleError = function (err) {
  console.log(err.toString());
  this.emit('end');
};
