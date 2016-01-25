// using generator-webapp 1.1.0
'use strict';

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

	// cfgurable paths
	var cfg = {
		app: 'src',
		dst: 'dist'
	};

	// Define the cfguration for all the tasks
	grunt.initConfig({

		// Project settings
		cfg: cfg,

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= cfg.dst %>/*',
						'!<%= cfg.dst %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},

		// Mocha testing framework cfguration options
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
		//          cwd: '<%= cfg.app %>/styles',
		//          src: ['*.{scss,sass}'],
		//          dest: '.tmp/styles',
		//          ext: '.css'
		//       }]
		//    }
		// },


		/**
		* These plugins can lint your CSS, support variables and mixins, 
		* transpile future CSS syntax, inline images, etc
		*
		* https://github.com/postcss/postcss
		*/
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

		// Renames files for browser caching purposes
		// https://www.npmjs.com/package/grunt-filerev
		filerev: {
			dist: {
				src: [
					'<%= cfg.dst %>/scripts/*.js',
					'<%= cfg.dst %>/scripts/ui/*.js'
					//'<%= cfg.dst %>/styles/{,*/}*.css',
					// '<%= cfg.dst %>/images/{,*/}*.*',
					// '<%= cfg.dst %>/styles/fonts/{,*/}*.*',
					// '<%= cfg.dst %>/*.{ico,png}'
				]
			}
		},

		// By default, your `index.html`'s <!-- Usemin block --> will take care
		// of minification. These next options are pre-cfgured if you do not
		// wish to use the Usemin blocks.
		cssmin: {
			dist: {
				files: {
					'<%= cfg.dst %>/styles/main.css': [
						'.tmp/styles/{,*/}*.css',
						'<%= cfg.app %>/styles/{,*/}*.css'
					]
				}
			}
		},

		/**
		 * Uglify: minify js files
		 * Needs to happen after JS file get copied to dist
		 * https://github.com/gruntjs/grunt-contrib-uglify
		 */
		uglify: {
			options: {
				preserveComments: false,
				screwIE8: true,
				mangle: false,
				cwd: '<%= cfg.app %>/scripts/vendor/'
				// exceptionsFiles: [
				// 	'datatables.min.js', 
				// 	'jquery-2.2.0.min.js'
				// ]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= cfg.app %>/scripts/vendor/',
					src: [ '*.js', '!datatables.min.js' ],
					dest: '<%= cfg.dst %>/scripts/vendor',
					ext:  '.min.js'
				}]
				// files: {
				// 	// This does not remove the original source files 
				// 	// { 
				// 	// 	src: 'src/scripts/vendor/jquery-ui.js', 
				// 	// 	dest: 'dist/scripts/vendor/jquery-ui.min.js'
				// 	// }
				// 	'<%= cfg.dst %>/scripts/vendor/jquery-ui.min.js':['<%= cfg.dst %>/scripts/vendor/jquery-ui.js'],
				// 	'<%= cfg.dst %>/scripts/vendor/modernizr.min.js':['<%= cfg.dst %>/scripts/vendor/modernizr.js']
				// }
			}// End uglify:dist
		},// End uglify task

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= cfg.app %>',
					dest: '<%= cfg.dst %>',
					src: [
						'{,*/}*.html',
						'scripts/**/*.{js,php}',
						// 'scripts/**/*.php',
						'*.{ico,png,txt}',
						// 'images/{,*/}*.webp',
						'data/*',
						'styles/fonts/{,*/}*.*',
						'styles/fa/{,*/}*.*',
						'styles/images/**/*.{gif,jpeg,jpg,png}',
						'styles/*.css'
					]// End src
				}]// End copy:dist - files
			}// End copy:dist
		},// End copy task

		// Auto save via FTP
		'ftp-deploy': {
			build: {
				auth: {
					host: 'sol.apisnetworks.com',
					port: 21,
					authKey: 'apisnetworks-key'
				},
				src: 'dist/',
				dest: '/var/www/html/middleofjune/dist/',
				exclusions: ['dist/.DS_Store', 'dist/Thumbs.db', 'dist/data/' ]
			 }
		}// End ftp-deploy task

		// Runs JSHint (code quality analysis tool) against app JS files
		// Rules defined in .jshintrc.
		// THROWS ERRORS!!
		//jshint: {
		// options: {
		//    jshintrc: '.jshintrc',
		//    reporter: require('jshint-stylish')
		// },
		// assess: ['<%=cfg.app%>/js/**/*.js'],
		// all: ['Gruntfile.js', '<%=cfg.app%>/js/**/*.js']
		//},

		// Watches files for changes and runs tasks based on what's changed
		//watch: require('./grunt-include/watch'),
		//browserSync: require('./grunt-include/browserSync'),

		// // Reads HTML for usemin blocks to enable smart builds that automatically
		// // concat, minify and revision files. Creates cfgurations in memory so
		// // additional tasks can operate on them
		// useminPrepare: {
		//    options: {
		//       dest: '<%= cfg.dst %>'
		//    },
		//    html: '<%= cfg.app %>/index.html'
		// },

		// // Performs rewrites based on rev and the useminPrepare cfguration
		// usemin: {
		//    options: {
		//       assetsDirs: [
		//          '<%= cfg.dst %>',
		//          '<%= cfg.dst %>/images',
		//          '<%= cfg.dst %>/styles'
		//       ]
		//    },
		//    html: ['<%= cfg.dst %>/{,*/}*.html'],
		//    css: ['<%= cfg.dst %>/styles/{,*/}*.css']
		// },

		// // The following *-min tasks produce minified files in the dist folder
		// imagemin: {
		//    dist: {
		//       files: [{
		//          expand: true,
		//          cwd: '<%= cfg.app %>/images',
		//          src: '{,*/}*.{gif,jpeg,jpg,png}',
		//          dest: '<%= cfg.dst %>/images'
		//       }]
		//    }
		// },

		// concat: {
		//  dist: {}
		// },

		


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

	});// End grunt initcfg

	// 
	// --- GRUNT REGISTER TASKS  -----------------------------------------------
	//
	grunt.registerTask('test', function (target) {
		if (target !== 'watch') {
			grunt.task.run([
				'clean:server',
				// 'concurrent:test',
				'postcss'
			]);
		}// End if target !== watch
	});// End task "test"

	// This is the default Grunt task if you simply run "grunt" in project dir
	grunt.registerTask('build', [
		'clean:dist',
		'postcss',
		'copy:dist',
		'uglify',
		'filerev'
	//   // 'wiredep',     // turn on only when bower-components is reinstated
	//   // 'useminPrepare',  // throws processing a template error ('test' is undefined)
	//   'concurrent:dist',
		
	//   // 'concat',
	//   'cssmin',
	//   'uglify',
		
		// 'filerev'
	//   'usemin',
	//   'htmlmin',
		
	]);// End register task :: build

	grunt.registerTask('default', [
		//'newer:eslint',
		'build',
		'test'
	]);// End register task :: default

	grunt.registerTask('production', [
		'clean:dist',
		'postcss',
		'copy:dist',
		'uglify',
		'ftp-deploy'
	]);

	
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

	

	//   grunt.task.run([
	//      'browserSync:test',
	//      'mocha'
	//   ]);
	// });// End register task :: test


	// Launch Browser-sync & watch files
	//  grunt.registerTask('watch', ['bs-init', 'watch']);
	


	//
	// LOAD NPM TASKS
	//
	// Once installed with "npm install <TASK_NAME> --save-dev",
	// we have to enable them!
	//
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-ftp-deploy');

};// End module.exports
