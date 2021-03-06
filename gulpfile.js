//----------------------------------------------------------------------
//  mode
//----------------------------------------------------------------------
'use strict';

//----------------------------------------------------------------------
//  require
//----------------------------------------------------------------------
const gulp = require('gulp');
const { src, dest, series, parallel, watch } = require('gulp');

const dartSass = require('gulp-sass')(require('sass'));

const del = require('del');
const bs = require('browser-sync');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');

const $ = require('gulp-load-plugins')();

//----------------------------------------------------------------------
//  path
//----------------------------------------------------------------------
const proj = {
	dev: './src',
	pro: './dist',
};

const paths = {
	clean: {
		src: `${proj.pro}/**`,
	},

	css: {
		src: `${proj.dev}/css/**`,
		dest: `${proj.pro}/css`,
	},
	font: {
		src: `${proj.dev}/font/**`,
		dest: `${proj.pro}/font`,
	},
	html: {
		src: `${proj.dev}/**/*.html`,
		dest: `${proj.pro}/`,
	},
	image: {
		src: `${proj.dev}/image/**`,
		dest: `${proj.pro}/image`,
	},
	js: {
		src: `${proj.dev}/js/**/*.js`,
		dest: `${proj.pro}/js`,
	},
	scss: {
		src: `${proj.dev}/scss/**.scss`,
		dest: `${proj.dev}/css/`,
	},
	vendor: {
		src: `${proj.dev}/vendor/**`,
		dest: `${proj.pro}/vendor`,
	},

	watch: [`${proj.dev}/**`, `!${proj.dev}/css/**`],
};

const bsConf = {
	base: `./`,
	start: `${proj.dev}/index.html`,
};

//----------------------------------------------------------------------
//  task
//----------------------------------------------------------------------
const clean = (done) => {
	del(paths.clean.src);

	done();
};

const development = (done) => {
	// css
	// 処理なし

	// font
	// 処理なし

	// html
	// 処理なし

	// image
	// 処理なし

	// js
	// 処理なし

	// sass
	src(paths.scss.src) // sassコンパイル
		.pipe($.plumber())
		.pipe($.sassGlobUseForward())
		.pipe(dartSass())
		.pipe($.autoprefixer())
		.pipe(dest(paths.scss.dest));

	// vendor
	// 処理なし

	done();
};

const production = (done) => {
	// css
	src(paths.css.src) // purge
		.pipe($.plumber())
		.pipe(
			$.purgecss({
				content: [paths.html.src, paths.js.src],
			})
		)
		.pipe($.cleanCss())
		.pipe(dest(paths.css.dest));

	// font
	src(paths.font.src) // copy
		.pipe($.plumber())
		.pipe(dest(paths.font.dest));

	// html
	src(paths.html.src) // copy
		.pipe($.plumber())
		.pipe(dest(paths.html.dest));

	// image
	src(paths.image.src) // minify
		.pipe($.plumber())
		.pipe($.changed(paths.image.dest))
		.pipe(
			$.imagemin([
				pngquant({
					quality: [0.6, 0.7],
					speed: 1,
				}),
				mozjpeg({ quality: 65 }),
				$.imagemin.svgo(),
				$.imagemin.optipng(),
				$.imagemin.gifsicle({
					optimizationLevel: 3,
				}),
			])
		)
		.pipe(dest(paths.image.dest));

	// js
	src(paths.js.src) // minify
		.pipe($.plumber())
		.pipe($.uglify())
		.pipe(dest(paths.js.dest));

	// sass
	// 処理なし

	// vendor
	src(paths.vendor.src) // copy
		.pipe($.plumber())
		.pipe(dest(paths.vendor.dest));

	done();
};

const bsInit = (done) => {
	bs.init({
		server: {
			baseDir: bsConf.base,
		},
		startPath: bsConf.start,
		notify: false,
		open: 'external',
	});

	done();
};

const bsReload = (done) => {
	bs.reload();

	done();
};

//----------------------------------------------------------------------
//  watchTask
//----------------------------------------------------------------------
const watchTask = (done) => {
	watch(paths.watch, series(development, bsReload));

	done();
};

//----------------------------------------------------------------------
//  export
//----------------------------------------------------------------------
exports.clean = clean;
exports.development = series(development, bsInit, bsReload, watchTask);
exports.production = series(production);

/************************************************************************/
/*  END OF FILE																													*/
/************************************************************************/
