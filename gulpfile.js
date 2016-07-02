var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var es = require('event-stream');


var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n'
};


gulp.task('default', ['build']);
gulp.task('build', ['scripts']);
gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*.{js,html}'], ['build']);
});
gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('scripts', ['clean'], function () {
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
            .pipe($.concat('uform_without_templates.js'))
            .pipe($.header('(function() { \n"user strict";\n'))
            .pipe($.footer('\n}());'))
    };
    return es.merge(buildLib(), buildTemplates())
        .pipe($.plumber({
             errorHandler: handleError
        }))
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


// var gulp = require("gulp");
// var ngHtml2Js = require("gulp-ng-html2js");
// var minifyHtml = require("gulp-minify-html");
// var concat = require("gulp-concat");
// var uglify = require("gulp-uglify");
// var through = require('through2');
// var ngAnnotate = require('gulp-ng-annotate');
// gulp.task("compile-html-2-js",function(){
// 	gulp.src(["./form-templates/**.html","./field-templates/**/**.html"])
// 	// .pipe(minifyHtml({
// 	// 	empty: true,
// 	// 	spare: true,
// 	// 	quotes: true
// 	// }))
// 	.pipe(ngHtml2Js({
// 		moduleName: "uForm",
// 		prefix: "templates/",
// 		rename: function(templateUrl, templateFile){
// 			var arr = templateUrl.split("/");
// 			return arr[0] + "/" + arr[arr.length - 1];
// 		}
// 	}))
// 	.pipe(concat("templates.js"))
// 	// .pipe(uglify())
// 	.pipe(gulp.dest("./dist/templates"));
// })
// gulp.task("compile-html-2-js-min",function(){
// 	gulp.src(["./form-templates/**.html","./field-templates/**/**.html"])
// 	.pipe(minifyHtml({
// 		empty: true,
// 		spare: true,
// 		quotes: true
// 	}))
// 	.pipe(ngHtml2Js({
// 		moduleName: "uForm",
// 		prefix: "templates/",
// 		rename: function(templateUrl, templateFile){
// 			var arr = templateUrl.split("/");
// 			return arr[0] + "/" + arr[arr.length - 1];
// 		}
// 	}))
// 	.pipe(concat("templates.min.js"))
// 	.pipe(uglify())
// 	.pipe(gulp.dest("./dist/templates"));
// })
// gulp.task('compile-js',function(){
// 	gulp.src(["./upForm.js","./field-templates/ext/**/**.js","./dist/templates/templates.js"])
// 	.pipe(concat('upForm.js'))
// 	.pipe(ngAnnotate())
// 	.pipe(gulp.dest('./dist'))

// });
// gulp.task('compile-js-min',function(){
// 	gulp.src(["./upForm.js","./field-templates/ext/**/**.js","./dist/templates/templates.min.js"])
// 	.pipe(concat('upForm.min.js'))
// 	.pipe(ngAnnotate())
// 	.pipe(uglify())
// 	.pipe(gulp.dest('./dist'))

// });
// gulp.task("generate",["compile-html-2-js",'compile-js'])
// gulp.task("generate-min",["compile-html-2-js-min",'compile-js-min'])
