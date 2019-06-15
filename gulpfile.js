const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const typedoc = require('gulp-typedoc');
const gulpClean = require('gulp-clean');
const terser = require('gulp-terser');
const tslint = require('gulp-tslint');
const pump = require('pump');
const ts = require('gulp-typescript');

const TO_CLEAN = ['dist', 'docs', '*.tgz'];
const SOURCE = 'src/**/*.ts';
const NAME = 'vk-chat-bot';
const DEST_FOLDER = 'dist';
const DOCS_FOLDER = './docs';
const TSCONFIG = 'tsconfig.json';

function clean(cb) {
  pump(
    [gulp.src(TO_CLEAN, { read: false, allowEmpty: true }), gulpClean()],
    cb
  );
}

function lint(cb) {
  pump(
    [
      gulp.src(SOURCE),
      tslint({
        formatter: 'verbose',
      }),
      tslint.report(),
    ],
    cb
  );
}

function build(cb) {
  const tsProject = ts.createProject(TSCONFIG);
  let streams = pump([gulp.src(SOURCE), sourcemaps.init(), tsProject()]);
  pump([streams.dts, gulp.dest(DEST_FOLDER)]);
  pump(
    [
      streams.js,
      terser(),
      sourcemaps.write(),
      gulp.dest(DEST_FOLDER),
    ],
    cb
  );
}

function docs(cb) {
  pump(
    [
      gulp.src(SOURCE, { read: false }),
      typedoc({
        tsconfig: TSCONFIG,
        out: DOCS_FOLDER,
        name: NAME,
        ignoreCompilerErrors: false,
        version: true,
      }),
    ],
    cb
  );
}

exports.clean = clean;
exports.build = build;
exports.lint = lint;
exports.docs = docs;

exports.default = gulp.series(
  exports.clean,
  exports.build,
  exports.lint,
  exports.docs,
);
