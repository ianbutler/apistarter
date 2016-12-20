

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import browserSync from 'browser-sync';
import colors from 'colors';
import babel from 'gulp-babel';
//import concat from 'gulp-concat';
//import uglify from 'gulp-uglify';
import merge from 'merge-stream';

const serverJsFiles = ['./index.js', './models/*.js', './routes/*.js', './passport.js'];

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

gulp.task('nodemon', function(cb) {
    let started = false;   
    const options = {
        script: './dist/index.js',
        //delayTime: 1,
        env: {       // environment variables
            'PORT': 3030 
        },
        ignore: [
            'node_modules/',
            'dist/'
        ],
        ext: 'js',       // all the jsFiles you specified above
        tasks: ['sendServerToDist']
    };

    var stream = nodemon(options)
        .on('start', function() {
            if (!started) {
                cb();
                started = true;
            }
        })
        .on('restart', function() {
            console.log("restart()")            
        })
        .on('crash', () => {
            console.error('Application has crashed!/n');
            stream.emit('restart', 4);
        });
});

gulp.task('sendServerToDist', () => {
    let indexFile = gulp.src('./index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist'));
    let modelFiles = gulp.src('./models/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist/models'));
    let routeFiles = gulp.src('./routes/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist/routes'));
    let passportFile = gulp.src('./passport.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist/'));

    return merge(indexFile, modelFiles, routeFiles, passportFile);
});
