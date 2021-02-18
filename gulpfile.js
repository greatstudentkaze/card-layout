import gulp from 'gulp';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import nested from 'postcss-nested';
import simpleVars from 'postcss-simple-vars';
import nestedVars from 'postcss-nested-vars';
import stylelint from 'stylelint';
import reporter from 'postcss-reporter';
import plumber from 'gulp-plumber';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';
import sync from 'browser-sync';
import rename from 'gulp-rename';

sync.create();

const Directory = {
  SOURCE: 'source',
  BUILD: 'build',
};

const plugins = [
  postcssImport(),
  nested(),
  nestedVars(),
  stylelint(),
  autoprefixer(),
  cssnano(),
  reporter({ clearReportedMessages: true }),
];

export const styles = () =>
  gulp.src(`${Directory.SOURCE}/css/index.css`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${Directory.BUILD}/css`))
    .pipe(sync.stream());

export const clean = () => del(Directory.BUILD);

export const copy = () =>
  gulp.src([
    `${Directory.SOURCE}/**/*.html`,
    `${Directory.SOURCE}/**/*.js`,
    `${Directory.SOURCE}/fonts/**/*.{woff,woff2}`,
    `${Directory.SOURCE}/img/**`,
    `${Directory.SOURCE}/*.ico`,
  ], { base: Directory.SOURCE })
    .pipe(gulp.dest(Directory.BUILD))
    .pipe(sync.stream());

export const build = gulp.series(
  clean,
  copy,
  styles,
);

export const server = (done) => {
  sync.init({
    server: {
      baseDir: Directory.BUILD,
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

export const watcher = () => {
  gulp.watch(`${Directory.SOURCE}/css/**/*.css`, gulp.series(styles));
  gulp.watch(`${Directory.SOURCE}/js/**/*.js`, gulp.series(copy));
  gulp.watch(`${Directory.SOURCE}/**/*.html`, gulp.series(copy));
};

export default gulp.series(build, server, watcher);
