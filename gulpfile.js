var gulp = require('gulp');
var pug = require('gulp-pug');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var del = require('del');
var sass = require('gulp-sass');
var processors = [
	autoprefixer({browsers: ['last 2 version']})
];
var yaml = require('gulp-yaml');

const ignorePug = [
	'!src/layouts/**',
	'!src/blocks/**',
	'!src/globals/**'
];

gulp.task('yaml', function(){
	return gulp.src('src/**/*.yml')
		.pipe(yaml())
		.pipe(gulp.dest('build/assets'))
})

gulp.task('html', function(){
	return gulp.src(['src/**/*.pug', ...ignorePug])
		.pipe(pug())
		.pipe(gulp.dest('build'))
});


gulp.task('js', function(){
	return gulp.src('src/assets/*.js')
		.pipe(gulp.dest('build/assets'))
});

gulp.task('sass', function () {
	return gulp.src('src/assets/**/*.sass')
	    .pipe(sass.sync().on('error', sass.logError))
		.pipe(postcss(processors))
	    .pipe(gulp.dest('build/assets'))
		.pipe(browserSync.stream())
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

var reload = function(done){
	browserSync.reload();
	done();
}

gulp.task('watch', function() {
	gulp.watch('src/**/*.pug', gulp.series('html', reload));
	gulp.watch('src/**/*.sass', gulp.series('sass'));
	gulp.watch('src/**/*.js', gulp.series('js', reload));
	gulp.watch('src/**/*.yml', gulp.series('yaml'));
});

gulp.task('copy', function(){
	return gulp.src([
			'src/assets/**/*.{jpg,png,jpeg,svg,gif}'
		])
	.pipe(gulp.dest('build/assets'))
});

gulp.task('clean', function() {
	return del('build');
});

gulp.task('build', gulp.parallel('html', 'sass', 'yaml', 'js', 'copy'));
gulp.task('start', gulp.parallel('watch', 'serve'));

gulp.task('default', gulp.series('clean', 'build', 'start'));






