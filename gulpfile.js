/* VARIABLES SETUP - plugins */
const { dest, gulp, parallel, series, src, lastRun, watch } = require("gulp"),
  concat = require("gulp-concat"),
  livereload = require("gulp-livereload"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  /* VARIABLES SETUP - plugins options */
  sassOptionsDev = {
    errLogToConsole: true,
    precision: 10,
    sourceComments: false, // true,
    outputStyle: "compact",
  },
  /* VARIABLES SETUP - files */
  blStyleFiles = "source/sass/**/*",
  jsPluginFiles = "source/js/jquery*.*",
  blScriptFiles = "source/js/bl*.js",
  frontEndFiles = ["*.htm*", "*.php"];


/* FUNCTION DEFINITIONS */
function preloadJS() {
  return src(jsPluginFiles, { allowEmpty: true })
    .pipe(dest("scripts/"));
}


function workScriptDev() {
  return src(blScriptFiles, { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(concat("site.js", { newLine: ";" }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("scripts/"))
    .pipe(livereload());
}

function workStyleDev() {
  return src("source/sass/site.sass", { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(sass.sync(sassOptionsDev).on("error", sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("styles/").on("finish", (callback) => livereload.reload()));
}


/* WATCH FUNCTION */
function watchFiles() {
  watch(blStyleFiles, workStyleDev);
  watch(jsPluginFiles, preloadJS);
  watch(blScriptFiles, workScriptDev);
  watch(frontEndFiles).on("change", livereload.reload);
  console.log(">> Begun watching for changes...");
}


/* SERVER SETUP FUNCTION */
function setupServer() {
  livereload.listen(function () {
    console.log(">> The server has been established...");
    setTimeout(function () {
      console.log(">> ...let's begin development...");
    }, 600);
  });
}


/* FINAL EXPORTS */
exports.default = series(
  preloadJS,
  workScriptDev,
  workStyleDev,
  parallel(setupServer, watchFiles)
);
