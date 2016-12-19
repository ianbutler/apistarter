

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import browserSync from 'browser-sync';
import colors from 'colors';
//import sass from 'gulp-sass';
//import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
//import concat from 'gulp-concat';
//import inject from 'gulp-inject';
//import {stream as wiredep} from 'wiredep';
//import uglify from 'gulp-uglify';

const serverJsFiles = ['index.js', './models/*.js', './routes/*.js'];

gulp.task('serve', ['nodemon'], () => {});

// gulp.task('browser-sync', [], function() {
//     const browserSyncCreate = browserSync.create();
//     browserSyncCreate.init(null, {
//         proxy: 'http://localhost:3000',
//         browser: 'google chrome',
//         files: [serverJsFiles],
//         port: 7080,
//         reloadDelay: 1000,
//         ui: false
//     });
// });

gulp.task('nodemon', ['sendServerToDist'], function(cb) {
    let started = false;   
    const options = {
        script: './dist/index.js',
        //delayTime: 1,
        env: {       // environment variables
            'PORT': 3030 
        },
        watch: serverJsFiles        // all the jsFiles you specified above
    };

    return nodemon(options)
        .on('start', function() {
            if (!started) {
                cb();
                started = true;
            }
        })
        .on('restart', function() {
            gulp.src('./index.js')
                .pipe(babel({
                    presets: ['es2015']
                }))
                .pipe(gulp.dest('./dist'));
            gulp.src('./routes/*.js')
                .pipe(babel({
                    presets: ['es2015']
                }))
                .pipe(gulp.dest('./dist/routes'));
            gulp.src('./models/*.js')
                .pipe(babel({
                    presets: ['es2015']
                }))
                .pipe(gulp.dest('./dist/models'));
        });
});

gulp.task('sendServerToDist', () => {
    gulp.src('./index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist'));
    gulp.src('./models/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist/models'));
    gulp.src('./routes/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist/routes'));
});
