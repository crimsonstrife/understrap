// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('autoprefixer');

// Configuration file to keep your code DRY
var cfg = require('./gulpconfig.json');
var paths = cfg.paths;

/**
 * Compiles .scss to .css files.
 *
 * Run: gulp sass
 */
gulp.task('sass', function() {
    return gulp
        .src(paths.sass + '/*.scss')
        .pipe(
            plumber({
                errorHandler(err) {
                    console.log(err);
                    this.emit('end');
                },
            })
        )
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass({ errLogToConsole: true }))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write(undefined, { sourceRoot: null }))
        .pipe(gulp.dest(paths.css));
});

/**
 * Optimizes images and copies images from src to dest.
 *
 * Run: gulp imagemin
 */
gulp.task('imagemin', () =>
    gulp
    .src(paths.imgsrc + '/**')
    .pipe(
        imagemin(
            [
                // Bundled plugins
                imagemin.gifsicle({
                    interlaced: true,
                    optimizationLevel: 3,
                }),
                imagemin.mozjpeg({
                    quality: 100,
                    progressive: true,
                }),
                imagemin.optipng(),
                imagemin.svgo(),
            ], {
                verbose: true,
            }
        )
    )
    .pipe(gulp.dest(paths.img))
);

<<
<< << < HEAD
// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task("watch", function() {
    gulp.watch(
        [`${paths.sass}/**/*.scss`, `${paths.sass}/*.scss`],
        gulp.series("styles")
    );
    gulp.watch(
        [
            `${paths.dev}/js/**/*.js`,
            "js/**/*.js",
            "!js/theme.js",
            "!js/theme.min.js",
        ],
        gulp.series("scripts")
    );

    //Inside the watch task.
    gulp.watch(`${paths.imgsrc}/**`, gulp.series("imagemin-watch"));
});

// Run:
// gulp imagemin
// Running image optimizing task
gulp.task("imagemin", function() {
    gulp.src(`${paths.imgsrc}/**`).pipe(imagemin()).pipe(gulp.dest(paths.img));
}); ===
=== =
/**
 * Minifies css files.
 *
 * Run: gulp minifycss
 */
gulp.task('minifycss', function() {
    return gulp
        .src([
            paths.css + '/custom-editor-style.css',
            paths.css + '/theme.css',
        ])
        .pipe(
            sourcemaps.init({
                loadMaps: true,
            })
        )
        .pipe(
            cleanCSS({
                compatibility: '*',
            })
        )
        .pipe(
            plumber({
                errorHandler(err) {
                    console.log(err);
                    this.emit('end');
                },
            })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css));
});

/**
 * Delete minified CSS files and their maps
 *
 * Run: gulp cleancss
 */
gulp.task('cleancss', function() {
    return del(paths.css + '/*.min.css*');
});

/**
 * Compiles .scss to .css minifies css files.
 *
 * Run: gulp styles
 */
gulp.task('styles', function(callback) {
    gulp.series('sass', 'minifycss')(callback);
});

/**
 * Watches .scss, .js and image files for changes.
 * On change re-runs corresponding build task.
 * 
 * Run: gulp watch
 */
gulp.task('watch', function() {
    gulp.watch(
        [paths.sass + '/**/*.scss', paths.sass + '/*.scss'],
        gulp.series('styles')
    );
    gulp.watch(
        [
            paths.dev + '/js/**/*.js',
            'js/**/*.js',
            '!js/theme.js',
            '!js/theme.min.js',
        ],
        gulp.series('scripts')
    );

    // Inside the watch task.
    gulp.watch(paths.imgsrc + '/**', gulp.series('imagemin-watch'));
});

/**
 * Starts browser-sync task for starting the server.
 *
 * Run: gulp browser-sync
 */
gulp.task('browser-sync', function() {
    browserSync.init(cfg.browserSyncOptions);
}); >>>
>>> > pr / 12

/**
 * Ensures the 'imagemin' task is complete before reloading browsers
 */
gulp.task( <<
        << << < HEAD "imagemin-watch",
        gulp.series("imagemin", function() { ===
                === =
                'imagemin-watch',
                gulp.series('imagemin', function() { >>>
                    >>> > pr / 12
                    browserSync.reload();
                })
            );

            <<
            << << < HEAD
            // Run:
            // gulp cssnano
            // Minifies CSS files
            gulp.task("cssnano", function() {
                return gulp
                    .src(paths.css + "/theme.css")
                    .pipe(sourcemaps.init({ loadMaps: true }))
                    .pipe(
                        plumber({
                            errorHandler: function(err) {
                                console.log(err);
                                this.emit("end");
                            },
                        })
                    )
                    .pipe(rename({ suffix: ".min" }))
                    .pipe(cssnano({ discardComments: { removeAll: true } }))
                    .pipe(sourcemaps.write("./"))
                    .pipe(gulp.dest(paths.css))
                    .pipe(touch());
            });

            gulp.task("minifycss", function() {
                return gulp
                    .src([`${paths.css}/custom-editor-style.css`, `${paths.css}/theme.css`])
                    .pipe(
                        sourcemaps.init({
                            loadMaps: true,
                        })
                    )
                    .pipe(
                        cleanCSS({
                            compatibility: "*",
                        })
                    )
                    .pipe(
                        plumber({
                            errorHandler: function(err) {
                                console.log(err);
                                this.emit("end");
                            },
                        })
                    )
                    .pipe(rename({ suffix: ".min" }))
                    .pipe(sourcemaps.write("./"))
                    .pipe(gulp.dest(paths.css))
                    .pipe(touch());
            });

            gulp.task("cleancss", function() {
                return gulp
                    .src(`${paths.css}/*.min.css`, { read: false }) // Much faster
                    .pipe(ignore("theme.css"))
                    .pipe(rimraf());
            });

            gulp.task("styles", function(callback) {
                gulp.series("sass", "minifycss")(callback);
            });

            // Run:
            // gulp browser-sync
            // Starts browser-sync task for starting the server.
            gulp.task("browser-sync", function() {
                browserSync.init(cfg.browserSyncWatchFiles, cfg.browserSyncOptions);
            }); ===
            === =
            /**
             * Starts watcher with browser-sync.
             * Browser-sync reloads page automatically on your browser.
             * 
             * Run: gulp watch-bs
             */
            gulp.task('watch-bs', gulp.parallel('browser-sync', 'watch')); >>>
            >>> > pr / 12

            // Run:
            // gulp scripts.
            // Uglifies and concat all JS files into one
            <<
            << << < HEAD gulp.task("scripts", function() {
                var scripts = [
                    // Start - All BS4 stuff

                    // Full BS4 JS file. Comment this out if you are using the individual modules below
                    paths.dev + "/js/bootstrap4/bootstrap.js",

                    // BS4 Modules. Select which BS4 modules to include.
                    // Comment out the main BS4 file above if you use the modules below.
                    // Include util.js and index.js if you use any of the modules below.
                    //paths.dev + '/js/bootstrap4/dist/util.js', // Required for all individual modules
                    //paths.dev + '/js/bootstrap4/dist/alert.js',
                    //paths.dev + '/js/bootstrap4/dist/button.js',
                    //paths.dev + '/js/bootstrap4/dist/carousel.js',
                    //paths.dev + '/js/bootstrap4/dist/collapse.js',
                    //paths.dev + '/js/bootstrap4/dist/dropdown.js', // Requires popper.js
                    //paths.dev + '/js/bootstrap4/dist/modal.js',
                    //paths.dev + '/js/bootstrap4/dist/popover.js', // Requires popper.js
                    //paths.dev + '/js/bootstrap4/dist/scrollspy.js',
                    //paths.dev + '/js/bootstrap4/dist/tab.js',
                    //paths.dev + '/js/bootstrap4/dist/tooltip.js', // Requires popper.js
                    //paths.dev + '/js/bootstrap4/dist/index.js', // Required for all individual modules

                    // End - All BS4 stuff

                    paths.dev + "/js/skip-link-focus-fix.js",

                    // Adding currently empty javascript file to add on for your own themes´ customizations
                    // Please add any customizations to this .js file only!
                    paths.dev + "/js/custom-javascript.js",
                ];
                gulp
                    .src(scripts)
                    .pipe(concat("theme.min.js"))
                    .pipe(uglify())
                    .pipe(gulp.dest(paths.js));

                gulp.src(scripts).pipe(concat("theme.js")).pipe(gulp.dest(paths.js));
            });

            // Deleting any file inside the /src folder
            gulp.task("clean-source", function() {
                return del(["src/**/*"]);
            });

            // Run:
            // gulp watch-bs
            // Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
            gulp.task("watch-bs", gulp.parallel("browser-sync", "watch")); ===
            === =
            gulp.task('scripts', function() {
                var scripts = [
                    // Start - All BS4 stuff
                    paths.dev + '/js/bootstrap4/bootstrap.bundle.js',
                    paths.dev + '/js/themejs/*.js',

                    // End - All BS4 stuff

                    paths.dev + '/js/skip-link-focus-fix.js',

                    // Adding currently empty javascript file to add on for your own themes´ customizations
                    // Please add any customizations to this .js file only!
                    paths.dev + '/js/custom-javascript.js',
                ];
                gulp
                    .src(scripts, { allowEmpty: true })
                    .pipe(babel({ presets: ['@babel/preset-env'] }))
                    .pipe(concat('theme.min.js'))
                    .pipe(uglify())
                    .pipe(gulp.dest(paths.js));

                return gulp
                    .src(scripts, { allowEmpty: true })
                    .pipe(babel())
                    .pipe(concat('theme.js'))
                    .pipe(gulp.dest(paths.js));
            });

            // Deleting any file inside the /src folder
            gulp.task('clean-source', function() {
                return del(['src/**/*']);
            }); >>>
            >>> > pr / 12

            // Run:
            // gulp copy-assets.
            // Copy all needed dependency assets files from node_modules to theme's /js, /scss and /fonts folder. Run this task after npm update

            ////////////////// All Bootstrap SASS  Assets /////////////////////////
            <<
            << << < HEAD gulp.task("copy-assets", function() { ===
                === =
                gulp.task('copy-assets', function(done) { >>>
                    >>> > pr / 12
                        ////////////////// All Bootstrap 4 Assets /////////////////////////
                        // Copy all pre-compiled JS files
                    var stream = gulp <<
                        << << < HEAD
                        .src(paths.node + "bootstrap/dist/js/**/*.js")
                        .pipe(gulp.dest(paths.dev + "/js/bootstrap4"));

                    // Copy all individual dist JS files
                    var stream = gulp
                        .src(paths.node + "bootstrap/js/dist/*.js")
                        .pipe(gulp.dest(paths.dev + "/js/bootstrap4/dist/"));

                    // Copy all Bootstrap SCSS files
                    gulp
                        .src(paths.node + "bootstrap/scss/**/*.scss")
                        .pipe(gulp.dest(paths.dev + "/sass/bootstrap4")); ===
                    === =
                    .src(paths.node + '/bootstrap/dist/js/**/*.js')
                        .pipe(gulp.dest(paths.dev + '/js/bootstrap4'));

                    // Copy all Bootstrap SCSS files
                    gulp
                        .src(paths.node + '/bootstrap/scss/**/*.scss')
                        .pipe(gulp.dest(paths.dev + '/sass/bootstrap4')); >>>
                    >>> > pr / 12

                    ////////////////// End Bootstrap 4 Assets /////////////////////////

                    // Copy all Font Awesome Fonts
                    gulp
                        <<
                        << << < HEAD
                        .src(paths.node + "font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}")
                        .pipe(gulp.dest("./fonts"));

                    // Copy all Font Awesome SCSS files
                    gulp
                        .src(paths.node + "font-awesome/scss/*.scss")
                        .pipe(gulp.dest(paths.dev + "/sass/fontawesome"));

                    // _s SCSS files
                    gulp
                        .src(paths.node + "undescores-for-npm/sass/media/*.scss")
                        .pipe(gulp.dest(paths.dev + "/sass/underscores"));

                    // _s JS files into /src/js
                    gulp
                        .src(paths.node + "undescores-for-npm/js/skip-link-focus-fix.js")
                        .pipe(gulp.dest(paths.dev + "/js"));

                    // Copy Popper JS files
                    gulp
                        .src(paths.node + "popper.js/dist/umd/popper.min.js")
                        .pipe(gulp.dest(paths.js + paths.vendor));
                    gulp
                        .src(paths.node + "popper.js/dist/umd/popper.js")
                        .pipe(gulp.dest(paths.js + paths.vendor));
                    return stream;
                });

                // Deleting the files distributed by the copy-assets task
                gulp.task("clean-vendor-assets", function() {
                    return del([
                        `${paths.dev}/js/bootstrap4/**`,
                        `${paths.dev}/sass/bootstrap4/**`,
                        "./fonts/*wesome*.{ttf,woff,woff2,eot,svg}",
                        `${paths.dev}/sass/fontawesome/**`,
                        `${paths.dev}/sass/underscores/**`,
                        `${paths.dev}/js/skip-link-focus-fix.js`,
                        `${paths.js}/**/skip-link-focus-fix.js`,
                        `${paths.js}/**/popper.min.js`,
                        `${paths.js}/**/popper.js`,
                        paths.vendor !== "" ? paths.js + paths.vendor + "/**" : "",
                    ]);
                });

                // Deleting any file inside the /dist folder
                gulp.task("clean-dist", function() {
                    return del([paths.dist + "/**"]);
                }); ===
                === =
                .src(paths.node + '/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}')
                    .pipe(gulp.dest(paths.fonts));

                // Copy all Font Awesome SCSS files
                gulp
                    .src(paths.node + '/font-awesome/scss/*.scss')
                    .pipe(gulp.dest(paths.dev + '/sass/fontawesome'));

                done();
            });

            // Deleting the files distributed by the copy-assets task
            gulp.task('clean-vendor-assets', function() {
                return del([
                    paths.dev + '/js/bootstrap4',
                    paths.dev + '/sass/bootstrap4',
                    paths.fonts + '/*wesome*.{ttf,woff,woff2,eot,svg}',
                    paths.dev + '/sass/fontawesome',
                    paths.js + paths.vendor,
                ]);
            });

            /**
             * Deletes all files inside the dist folder and the folder itself.
             *
             * Run: gulp clean-dist
             */
            gulp.task('clean-dist', function() {
                return del(paths.dist);
            }); >>>
            >>> > pr / 12

            // Run
            // gulp dist
            // Copies the files to the dist folder for distribution as simple theme
            gulp.task( <<
                << << < HEAD "dist",
                gulp.series(["clean-dist"], function() {
                    return gulp
                        .src(
                            [
                                "**/*",
                                `!${paths.bower}`,
                                `!${paths.bower}/**`,
                                `!${paths.node}`,
                                `!${paths.node}/**`,
                                `!${paths.dev}`,
                                `!${paths.dev}/**`,
                                `!${paths.dist}`,
                                `!${paths.dist}/**`,
                                `!${paths.distprod}`,
                                `!${paths.distprod}/**`,
                                `!${paths.sass}`,
                                `!${paths.sass}/**`,
                                "!readme.txt",
                                "!readme.md",
                                "!package.json",
                                "!package-lock.json",
                                "!gulpfile.js",
                                "!gulpconfig.json",
                                "!CHANGELOG.md",
                                "!.travis.yml",
                                "!jshintignore",
                                "!codesniffer.ruleset.xml",
                                "*",
                            ], { buffer: true }
                        )
                        .pipe(
                            replace(
                                "/js/jquery.slim.min.js",
                                "/js" + paths.vendor + "/jquery.slim.min.js", { skipBinary: true }
                            )
                        )
                        .pipe(
                            replace("/js/popper.min.js", "/js" + paths.vendor + "/popper.min.js", {
                                skipBinary: true,
                            })
                        )
                        .pipe(
                            replace(
                                "/js/skip-link-focus-fix.js",
                                "/js" + paths.vendor + "/skip-link-focus-fix.js", { skipBinary: true }
                            )
                        )
                        .pipe(gulp.dest(paths.dist))
                        .pipe(touch());
                })
            );

            // Deleting any file inside the /dist-product folder
            gulp.task("clean-dist-product", function() {
                return del([paths.distprod + "/**"]);
            }); ===
            === =
            'dist',
            gulp.series(['clean-dist'], function() {
                return gulp
                    .src(
                        [
                            '**/*',
                            '!' + paths.node,
                            '!' + paths.node + '/**',
                            '!' + paths.dev,
                            '!' + paths.dev + '/**',
                            '!' + paths.dist,
                            '!' + paths.dist + '/**',
                            '!' + paths.distprod,
                            '!' + paths.distprod + '/**',
                            '!' + paths.sass,
                            '!' + paths.sass + '/**',
                            '!' + paths.composer,
                            '!' + paths.composer + '/**',
                            '!+(readme|README).+(txt|md)',
                            '!*.+(dist|json|js|lock|xml)',
                            '!CHANGELOG.md',
                        ], { buffer: true }
                    )
                    .pipe(gulp.dest(paths.dist));
            })
        );

        /**
         * Deletes all files inside the dist-product folder and the folder itself.
         *
         * Run: gulp clean-dist-product
         */
        gulp.task('clean-dist-product', function() {
            return del(paths.distprod);
        }); >>>
        >>> > pr / 12

        // Run
        // gulp dist-product
        // Copies the files to the /dist-prod folder for distribution as theme with all assets
        gulp.task( <<
            << << < HEAD "dist-product",
            gulp.series(["clean-dist-product"], function() {
                return gulp
                    .src([
                        "**/*",
                        `!${paths.bower}`,
                        `!${paths.bower}/**`,
                        `!${paths.node}`,
                        `!${paths.node}/**`,
                        `!${paths.dist}`,
                        `!${paths.dist}/**`,
                        `!${paths.distprod}`,
                        `!${paths.distprod}/**`,
                        "*",
                    ])
                    .pipe(gulp.dest(paths.distprod))
                    .pipe(touch());
            }) ===
            === =
            'dist-product',
            gulp.series(['clean-dist-product'], function() {
                return gulp
                    .src([
                        '**/*',
                        '!' + paths.node,
                        '!' + paths.node + '/**',
                        '!' + paths.composer,
                        '!' + paths.composer + '/**',
                        '!' + paths.dist,
                        '!' + paths.dist + '/**',
                        '!' + paths.distprod,
                        '!' + paths.distprod + '/**',
                    ])
                    .pipe(gulp.dest(paths.distprod));
            }) >>>
            >>> > pr / 12
        );

        // Run
        // gulp compile
        // Compiles the styles and scripts and runs the dist task
        <<
        << << < HEAD gulp.task("compile", gulp.series("styles", "scripts", "dist")); ===
        === =
        gulp.task('compile', gulp.series('styles', 'scripts', 'dist')); >>>
        >>> > pr / 12

        // Run:
        // gulp
        // Starts watcher (default task)
        <<
        << << < HEAD gulp.task("default", gulp.series("watch")); ===
        === =
        gulp.task('default', gulp.series('watch')); >>>
        >>> > pr / 12