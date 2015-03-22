var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var concat = require('gulp-concat');
var html2js = require('gulp-html2js');
var sass = require('gulp-sass');
var ngAnnotate = require('gulp-ng-annotate');
var karma = require('gulp-karma');

var protractor = require("gulp-protractor").protractor;
var webdriver_standalone = require("gulp-protractor").webdriver_standalone;
var webdriver_update = require('gulp-protractor').webdriver_update;


var config = {

    outputDir: './dist/',

    js: {
        entryFile: './src/md-date-picker.js',
        outputFile: 'md-date-picker.js'
    },

    html: {
        src: './src/**/*.html',
        outputFile: 'templates.js',
        outputModuleName: 'templates',
        outputDir: './tmp/'
    },

    sass: {
        src: './scss/**/*.scss',
        outputFile: 'md-date-picker.css',
        outputDir: './dist/'
    },

    test: {
        unit: {
            src: [
                './node_modules/angular/angular.js',
                './node_modules/angular-animate/angular-animate.js',
                './node_modules/angular-aria/angular-aria.js',
                './node_modules/angular-material/angular-material.js',
                './node_modules/angular-moment/node_modules/moment/moment.js',
                './node_modules/angular-moment/node_modules/moment/locale/ru.js',
                './src/**/*.js',
                './node_modules/angular-mocks/angular-mocks.js',
                './test/unit/**/*.js'
            ]
        },
        e2e: {
            src: [
                './test/e2e/**/*.js'
            ]
        }
    }

};

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;

function getBundler() {
    if (!bundler) {
        bundler = watchify(browserify(config.js.entryFile, _.extend({ debug: true }, watchify.args)));
    }
    return bundler;
};

function bundle() {
    return getBundler()
        .transform(babelify)
        .bundle()
        .on('error', function(err) { console.log('Error: ' + err.message); })
        .pipe(source(config.js.outputFile))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(config.outputDir))
        .pipe(reload({ stream: true }));
}

gulp.task('build-persistent', ['clean', 'sass'], function() {
    return bundle();
});

gulp.task('build', ['html2js', 'build-persistent'], function() {
    process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(config.html.src, ['html2js']);
    gulp.watch(config.sass.src, ['sass']);
    getBundler().on('update', function() {
        gulp.start('build-persistent')
    });
});

// Templates

gulp.task('html2js', function() {
    gulp.src(config.html.src)
        .pipe(html2js({
            outputModuleName: config.html.outputModuleName,
            useStrict: true
        }))
        .pipe(concat(config.html.outputFile))
        .pipe(gulp.dest(config.html.outputDir))
});

// Styles

gulp.task('sass', function () {
    gulp.src(config.sass.src)
        .pipe(sass())
        .pipe(gulp.dest(config.sass.outputDir))
        .pipe(browserSync.reload({stream:true}))
    ;
});

// Unit tests

gulp.task('test', function() {
    // Be sure to return the stream
    return gulp.src(config.test.unit.src)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }));
});

gulp.task('test:watch', function() {
    // Be sure to return the stream
    return gulp.src(config.test.unit.src)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'watch'
        }));
});

// E2E tests

gulp.task('webdriver_standalone', webdriver_standalone);

gulp.task('webdriver_update', webdriver_update);

gulp.task('e2e', ['webdriver_update'], function() {
    gulp.src(config.test.e2e.src)
        .pipe(protractor({
            configFile: "protractor.config.js",
            args: ['--baseUrl', 'http://127.0.0.1:3001']
        }))
        .on('error', function (e) {
            throw e
        });
});

// WEB SERVER
gulp.task('serve', function () {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});
