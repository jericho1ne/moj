// using generator-webapp 1.1.0
// 'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
//       'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
//       'test/spec/**/*.js'

module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
    // require('time-grunt')(grunt);

    // Automatically load required grunt tasks
    // require('jit-grunt')(grunt, {
    //   useminPrepare: 'grunt-usemin'
    // });

    // Configurable paths
    var config = {
        app: 'src',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

      // Project settings
      config: config,

      // Empties folders to start fresh
      clean: {
         dist: {
            files: [{
               dot: true,
               src: [
                  '.tmp',
                  '<%= config.dist %>/*',
                  '!<%= config.dist %>/.git*'
               ]
            }]
         },
         server: '.tmp'
      },

      // Runs JSHint (code quality analysis tool) against app JS files
      // Rules defined in .jshintrc.
      // THROWS ERRORS!!
      //jshint: {
      // options: {
      //    jshintrc: '.jshintrc',
      //    reporter: require('jshint-stylish')
      // },
      // assess: ['<%=config.app%>/js/**/*.js'],
      // all: ['Gruntfile.js', '<%=config.app%>/js/**/*.js']
      //},

      // Watches files for changes and runs tasks based on what's changed
      //watch: require('./grunt-include/watch'),
      //browserSync: require('./grunt-include/browserSync'),

      // Mocha testing framework configuration options
      mocha: {
         all: {
            options: {
               run: true,
               urls: ['http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/index.html']
            }
         }
      },
   
      // // Compiles Sass to CSS and generates necessary files if requested
      // sass: {
      //    options: {
      //       sourceMap: true,
      //       sourceMapEmbed: true,
      //       sourceMapContents: true,
      //       includePaths: ['.']
      //    },
      //    dist: {
      //       files: [{
      //          expand: true,
      //          cwd: '<%= config.app %>/styles',
      //          src: ['*.{scss,sass}'],
      //          dest: '.tmp/styles',
      //          ext: '.css'
      //       }]
      //    }
      // },

      postcss: {
         options: {
            map: true,
            processors: [
                // Add vendor prefixed styles
                require('autoprefixer')({
                    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
                })
            ]
         },
         dist: {
            files: [{
               expand: true,
               cwd: '.tmp/styles/',
               src: '{,*/}*.css',
               dest: '.tmp/styles/'
            }]
         }
      },


      // All the bower crap
      // wiredep: require('./grunt-include/wiredep'),

      // Renames files for browser caching purposes
      filerev: {
         dist: {
            src: [
               '<%= config.dist %>/scripts/{,*/}*.js',
               '<%= config.dist %>/styles/{,*/}*.css',
               '<%= config.dist %>/images/{,*/}*.*',
               '<%= config.dist %>/styles/fonts/{,*/}*.*',
               '<%= config.dist %>/*.{ico,png}'
            ]
         }
      },

      // // Reads HTML for usemin blocks to enable smart builds that automatically
      // // concat, minify and revision files. Creates configurations in memory so
      // // additional tasks can operate on them
      // useminPrepare: {
      //    options: {
      //       dest: '<%= config.dist %>'
      //    },
      //    html: '<%= config.app %>/index.html'
      // },

      // // Performs rewrites based on rev and the useminPrepare configuration
      // usemin: {
      //    options: {
      //       assetsDirs: [
      //          '<%= config.dist %>',
      //          '<%= config.dist %>/images',
      //          '<%= config.dist %>/styles'
      //       ]
      //    },
      //    html: ['<%= config.dist %>/{,*/}*.html'],
      //    css: ['<%= config.dist %>/styles/{,*/}*.css']
      // },

      // // The following *-min tasks produce minified files in the dist folder
      // imagemin: {
      //    dist: {
      //       files: [{
      //          expand: true,
      //          cwd: '<%= config.app %>/images',
      //          src: '{,*/}*.{gif,jpeg,jpg,png}',
      //          dest: '<%= config.dist %>/images'
      //       }]
      //    }
      // },


      // By default, your `index.html`'s <!-- Usemin block --> will take care
      // of minification. These next options are pre-configured if you do not
      // wish to use the Usemin blocks.
      cssmin: {
         dist: {
             files: {
                '<%= config.dist %>/styles/main.css': [
                   '.tmp/styles/{,*/}*.css',
                   '<%= config.app %>/styles/{,*/}*.css'
                ]
             }
          }
      },

      // uglify: {
      //    dist: {
      //        files: {
      //          '<%= config.dist %>/scripts/scripts.js': [
      //             '<%= config.dist %>/scripts/scripts.js'
      //          ]
      //       }
      //    }
      // },

      // concat: {
      //  dist: {}
      // },

      // Copies remaining files to places other tasks can use
      copy: {
         dist: {
            files: [{
               expand: true,
               dot: true,
               cwd: '<%= config.app %>',
               dest: '<%= config.dist %>',
               src: [
                '{,*/}*.html',
                'scripts/**/*.js',
                'scripts/**/*.php',
                '*.{ico,png,txt}',
                'images/{,*/}*.webp',
                'data/*',
                'styles/fonts/{,*/}*.*',
                'styles/fa/{,*/}*.*'
               ]
            }]
         }
      },

      // Run some tasks in parallel to speed up build process
      // concurrent: {
      //    server: [
      //       'babel:dist',
      //       'sass'
      //    ],
      //    test: [
      //       'babel'
      //    ],
      //    dist: [
      //       'babel',
      //       'sass',
      //       'imagemin',
      //       'svgmin'
      //    ]
      // },

      // Auto save via FTP
      // 'ftp-deploy': {
      //    build: {
      //       auth: {
      //          host: 'sol.apisnetworks.com',
      //          port: 21,
      //          authKey: 'apisnetworks-key'
      //       },
      //       src: 'dist/',
      //       dest: '/var/www/html/middleofjune/dist/',
      //       exclusions: ['dist/.DS_Store', 'dist/Thumbs.db', 'dist/data/' ]
      //    }
      // }

    });// End grunt initConfig

    // --- GRUNT SERVE --------------------------------------------------------------------
    //grunt.registerTask('serve', 'start the server and preview your app', function (target) {
      // if (target === 'dist') {
      //    return grunt.task.run(['build', 'browserSync:dist']);
      // }

      // grunt.task.run([
      //    'clean:server',
      //    // 'wiredep',     // turn on only when bower-components is reinstated
      //    'concurrent:server',
      //    'postcss',
      //    'browserSync:livereload',
      //    // 'ftp-deploy',
      //    'watch'
      // ]);
    //});// End serve task

    // grunt.registerTask('server', function (target) {
    //   grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    //   grunt.task.run([target ? ('serve:' + target) : 'serve']);
    // });// End register task :: server

    grunt.registerTask('test', function (target) {
      if (target !== 'watch') {
         grunt.task.run([
            'clean:server',
            // 'concurrent:test',
            'postcss'
         ]);
      }// End if target !== watch

    });// End task "test"

    //   grunt.task.run([
    //      'browserSync:test',
    //      'mocha'
    //   ]);
    // });// End register task :: test

    grunt.registerTask('build', [
         'clean:dist'
    //   // 'wiredep',     // turn on only when bower-components is reinstated
    //   // 'useminPrepare',  // throws processing a template error ('test' is undefined)
    //   'concurrent:dist',
    //   'postcss',
    //   // 'concat',
    //   'cssmin',
    //   'uglify',
    //   'copy:dist',
    //   'filerev',
    //   'usemin',
    //   'htmlmin',
    //   // 'ftp-deploy'
    ]);// End register task :: build

    grunt.registerTask('default', [
        //'newer:eslint',
        'test',
        'build'
    ]);// End register task :: default


    // Launch Browser-sync & watch files
    //  grunt.registerTask('watch', ['bs-init', 'watch']);
    
    // Once installed with "npm install <TASK_NAME> --save-dev",
    // we have to enable them!
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-postcss');
};// End module.exports
