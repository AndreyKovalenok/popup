const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
const sync = require('browser-sync').create();


function css() {
  return src('./src/**.scss')
    .pipe(sass())
    .pipe(dest('./src'))
}

function serve() {
  sync.init({
    server: './src'
  });

  watch('./src/**.html').on('change', sync.reload);
  watch('./src/**.scss', series(css)).on('change', sync.reload);
  watch('./src/**.js').on('change', sync.reload);
}

exports.start = series(css, serve);