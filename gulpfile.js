var gulp = require("gulp");
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var through = require('through2');
var ngAnnotate = require('gulp-ng-annotate');
gulp.task("compile-html-2-js",function(){
	gulp.src(["./form-templates/**.html","./field-templates/**/**.html"])
	// .pipe(minifyHtml({
	// 	empty: true,
	// 	spare: true,
	// 	quotes: true
	// }))
	.pipe(ngHtml2Js({
		moduleName: "uForm",
		prefix: "templates/",
		rename: function(templateUrl, templateFile){
			var arr = templateUrl.split("/");
			return arr[0] + "/" + arr[arr.length - 1];
		}
	}))
	.pipe(concat("templates.js"))
	// .pipe(uglify())
	.pipe(gulp.dest("./dist/templates"));
})
gulp.task("compile-html-2-js-min",function(){
	gulp.src(["./form-templates/**.html","./field-templates/**/**.html"])
	.pipe(minifyHtml({
		empty: true,
		spare: true,
		quotes: true
	}))
	.pipe(ngHtml2Js({
		moduleName: "uForm",
		prefix: "templates/",
		rename: function(templateUrl, templateFile){
			var arr = templateUrl.split("/");
			return arr[0] + "/" + arr[arr.length - 1];
		}
	}))
	.pipe(concat("templates.min.js"))
	.pipe(uglify())
	.pipe(gulp.dest("./dist/templates"));
})
gulp.task('compile-js',function(){
	gulp.src(["./upForm.js","./field-templates/ext/**/**.js","./dist/templates/templates.js"])
	.pipe(concat('upForm.js'))
	.pipe(ngAnnotate())
	.pipe(gulp.dest('./dist'))

});
gulp.task('compile-js-min',function(){
	gulp.src(["./upForm.js","./field-templates/ext/**/**.js","./dist/templates/templates.min.js"])
	.pipe(concat('upForm.min.js'))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(gulp.dest('./dist'))

});
gulp.task("generate",["compile-html-2-js",'compile-js'])
gulp.task("generate-min",["compile-html-2-js-min",'compile-js-min'])