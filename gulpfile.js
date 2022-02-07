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

const $ = require('gulp-load-plugins')({
  pattern: ['gulp{-,.}*', 'browser-sync', 'imagemin-pngquant', 'imagemin-mozjpeg'],
});

//----------------------------------------------------------------------
//  path
//----------------------------------------------------------------------
const proj = {
  dev: './src',
  pro: './dist',
};

const paths = {
  clean: {
    del: `${proj.pro}/**`,
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
    src: `${proj.dev}/html/**/*.html`,
    dest: `${proj.pro}/html`,
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

const bs = {
  base: `./`,
  start: `${proj.dev}/html/front-page.html`,
};

//----------------------------------------------------------------------
//  task
//----------------------------------------------------------------------
const clean = (done) => {
  del(paths.clean.del);

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
  src(paths.scss.src)
    .pipe($.plumber()) //	エラーになっても止めない
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
  src(paths.css.src)
    .pipe($.plumber()) //	エラーになっても止めない
    .pipe(
      $.purgecss({
        content: [paths.html.src, paths.js.src],
      })
    )
    .pipe($.cleanCss())
    .pipe(dest(paths.css.dest));

  // font
  src(paths.font.src)
    .pipe($.plumber()) //	エラーになっても止めない
    .pipe(dest(paths.font.dest));

  // html
  src(paths.html.src)
    .pipe($.plumber()) //	エラーになっても止めない
    .pipe(dest(paths.html.dest));

  // image
  src(paths.image.src)
    .pipe($.plumber()) //	エラーになっても止めない
    .pipe($.changed(paths.image.dest))
    .pipe(
      $.imagemin([
        $.imageminPngquant({
          quality: [0.6, 0.7],
          speed: 1,
        }),
        $.imageminMozjpeg({ quality: 65 }),
        $.imagemin.svgo(),
        $.imagemin.optipng(),
        $.imagemin.gifsicle({
          optimizationLevel: 3,
        }),
      ])
    )
    .pipe(dest(paths.image.dest));

  // js
  src(paths.js.src)
    .pipe($.plumber()) //	エラーになっても止めない
    .pipe(dest(paths.js.dest));

  // sass
  // 処理なし

  // vendor
  src(paths.vendor.src)
    .pipe($.plumber()) //	エラーになっても止めない
    .pipe(dest(paths.vendor.dest));

  done();
};

const bsInit = (done) => {
  $.browserSync.init({
    server: {
      baseDir: bs.base,
    },
    startPath: bs.start,
    notify: false,
    open: 'external',
  });

  done();
};

const bsReload = (done) => {
  $.browserSync.reload();

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
