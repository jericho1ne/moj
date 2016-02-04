/**
 * @file Gruntfile.js in all its greatness
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';

module.exports = function (grunt) {
	// Time how long tasks take;  Optimizing build times!
	require('time-grunt')(grunt);

	// Automatically load required grunt tasks
	// require('jit-grunt')(grunt, {
	//   useminPrepare: 'grunt-usemin'
	// });

	// cfgurable paths
	var cfg = {
		src: 'src',
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
			jsfiles: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= cfg.dst %>/scripts/common/*.js',
						'<%= cfg.dst %>/scripts/ui/*.js',
						//'<%= cfg.dst %>/scripts/vendor/*.js'
					]
				}]
			},
			maincss: {
				files: [{
					dot: true,
					src: [
						'<%= cfg.dst %>/styles/main.css'
					]
				}]
			},
			server: '.tmp'
		},
	   
		// Compiles Sass to CSS and generates necessary files if requested
		sass: {
			options: {
				sourceMap: true,
				sourceMapEmbed: true,
				sourceMapContents: true,
				includePaths: ['.']
			},
			dist: {
				// files: {
				// 	'<%= cfg.dst %>/styles/main.scss': '<%= cfg.dst %>/styles/main.css'
				// }			
				files: [{
					expand: true,
					cwd: '<%= cfg.src %>/styles',
					src: ['*.{scss,sass}'],
					dest: '.tmp/styles',
					ext: '.css'
				}]
			}
		},


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
					// Run this on any new box: npm install --save-dev grunt-postcss pixrem autoprefixer cssnano
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
					'<%= cfg.dst %>/scripts/ui/*.js',
					'<%= cfg.dst %>/styles/{,*/}*.css'
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
						'<%= cfg.src %>/styles/{,*/}*.css'
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
				cwd: '<%= cfg.src %>/scripts/vendor/'
				// exceptionsFiles: [
				// 	'datatables.min.js', 
				// 	'jquery-2.2.0.min.js'
				// ]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= cfg.src %>/scripts/vendor/',
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
					cwd: '<%= cfg.src %>',
					dest: '<%= cfg.dst %>',
					src: [
						'{,*/}*.html',
						'scripts/**/*.{js,php}',
						// 'scripts/**/*.php',
						'*.{ico,png,txt}',
						// 'images/{,*/}*.webp',
						'styles/fonts/{,*/}*.*',
						'styles/fa/{,*/}*.*',
						'styles/images/**/*.{gif,jpeg,jpg,png}',
						'media/images/**/*.{gif,jpeg,jpg,png}',
						'styles/*.css'
					]// End src
				}]// End copy:dist - files
			},// End copy:dist

			jsfiles: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= cfg.src %>',
					dest: '<%= cfg.dst %>',
					src: [
						'scripts/**/*.js'
					]// End src
				}]// End copy:jsfiles - files
			},// End copy:jsfiles

			phpfiles: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= cfg.src %>',
					dest: '<%= cfg.dst %>',
					src: [
						'scripts/api/*.php',
						'scripts/common/*.php'
					]// End src
				}]// End copy:phpfiles - files
			},// End copy:phpfiles

			htmlfiles: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= cfg.src %>',
					dest: '<%= cfg.dst %>',
					src: [
						'**/*.html'
					]// End src
				}]// End copy:htmlfiles - files
			},// End copy:htmlfiles

		},// End copy task

		//
		// TODO: https://github.com/nDmitry/grunt-postcss
		//

		/**
		 * Minify CSS
		 * 
		 *  npm install grunt-contrib-cssmin --save-dev
		 */
		cssmin: {
			dist: {
				 files: {
					 '<%= cfg.dst %>/styles/main.css': [
						 '.tmp/styles/{,*/}*.css',
						 '<%= cfg.src %>/styles/{,*/}*.css'
					 ]
				 }
			 }
		},// End task cssmin

		// Auto save via FTP
		'ftp-deploy': {
			build: {
				auth: {
					host: 'sol.apisnetworks.com',
					port: 21,
					authKey: 'apisnetworks-key'
				},
				// cache: 'sftpCache.json',
				src: '<%= cfg.dst %>',
				dest: '/var/www/html/middleofjune/dist/',
				exclusions: [
					'<%= cfg.dst %>/scripts/vendor/**/*',
					'<%= cfg.dst %>/styles/fa/**/*',
					'<%= cfg.dst %>/styles/images/**/*',
					'<%= cfg.dst %>/styles/fonts/**/*',
					'<%= cfg.dst %>/data/**/*', 
					'<%= cfg.dst %>/.DS_Store', 
					'<%= cfg.dst %>/Thumbs.db', 
					'<%= cfg.dst %>/tmp' ],
    			progress: true
			 },
			 live: {
				auth: {
					host: 'sol.apisnetworks.com',
					port: 21,
					authKey: 'apisnetworks-key'
				},
				src: '<%= cfg.dst %>',
				dest: '/var/www/html/middleofjune/',
				exclusions: [
					'/.DS_Store', 
					'/Thumbs.db', 
					'/data/', 
					'/tmp' ]
			 }
		},// End ftp-deploy task

		ftpush: {
			dev: {
				auth: {
					host: 'sol.apisnetworks.com',
					port: 21,
					authKey: 'apisnetworks-key'
				},
				src: '<%= cfg.dst %>',
				dest: '/var/www/html/middleofjune/dist/',
				exclusions: [
					'<%= cfg.dst %>/scripts/vendor/**/*',
					'<%= cfg.dst %>/styles/fa/**/*',
					'<%= cfg.dst %>/styles/images/**/*',
					'<%= cfg.dst %>/styles/fonts/**/*',
					'<%= cfg.dst %>/data/**', 
					'<%= cfg.dst %>/.*', 
					'<%= cfg.dst %>/Thumbs.db', 
					'<%= cfg.dst %>/tmp' ],
				// keep: ['/important/images/at/server/*.jpg'],
				simple: true,
				useList: false
			},// End ftpush:dev
			live: {
				auth: {
					host: 'sol.apisnetworks.com',
					port: 21,
					authKey: 'apisnetworks-key'
				},
				src: '<%= cfg.dst %>',
				dest: '/var/www/html/middleofjune/',
				exclusions: [
					'<%= cfg.dst %>/scripts/vendor/**/*',
					'<%= cfg.dst %>/styles/fa/**/*',
					'<%= cfg.dst %>/styles/images/**/*',
					'<%= cfg.dst %>/styles/fonts/**/*',
					'<%= cfg.dst %>/data/*', 
					'<%= cfg.dst %>/.DS_Store', 
					'<%= cfg.dst %>/Thumbs.db', 
					'<%= cfg.dst %>/tmp' ],
				// keep: ['/important/images/at/server/*.jpg'],
				simple: true,
				useList: false
			}// End ftppush:live

		}, 

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates cfgurations in memory so
		// additional tasks can operate on them
		// useminPrepare: {
		//    options: {
		//       dest: '<%= cfg.dst %>'
		//    },
		//    html: '<%= cfg.src %>/index.html'
		// },


		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: [
					'<%= cfg.dst %>',
					'<%= cfg.dst %>/images',
					'<%= cfg.dst %>/styles'
				]
			},
			html: ['<%= cfg.dst %>/{,*/}*.html'],
			css: ['<%= cfg.dst %>/styles/{,*/}*.css']
		},

		htmlmin: {    
			dist: {
				options: {
					removeComments: true,
					removeScriptTypeAttributes: false,
					collapseWhitespace: true,
					removeRedundantAttributes: false,
					removeEmptyAttributes: true,
					conservativeCollapse: true,
					removeAttributeQuotes: false,
					useShortDoctype: true
				},
				// Destination : source
				files: [{
					expand: true,
					cwd: '<%= cfg.dst %>',
					src: '{,*/}*.html',
					dest: '<%= cfg.dst %>'
				}]
			}// End htmlmin:dist
		},// End task htmlmin


		// Server w/ livereload
		express: {    
			all:{
  				options:{
  					port: 3000,
  					hostname: 'localhost',
  					bases: ['<%= cfg.dist %>'],
  					livereload:true	
  				}
  			}// End express:all
		},// End task express

		// Watches files for changes and runs tasks based on what's changed
		watch: require('./grunt-include/watch')

		// Runs JSHint (code quality analysis tool) against app JS files
		// Rules defined in .jshintrc.
		// THROWS ERRORS!!
		//jshint: {
		// options: {
		//    jshintrc: '.jshintrc',
		//    reporter: require('jshint-stylish')
		// },
		// assess: ['<%=cfg.src%>/js/**/*.js'],
		// all: ['Gruntfile.js', '<%=cfg.src%>/js/**/*.js']
		//},

		// Watches files for changes and runs tasks based on what's changed
		//watch: require('./grunt-include/watch'),
		//browserSync: require('./grunt-include/browserSync'),


		// // The following *-min tasks produce minified files in the dist folder
		// imagemin: {
		//    dist: {
		//       files: [{
		//          expand: true,
		//          cwd: '<%= cfg.src %>/images',
		//          src: '{,*/}*.{gif,jpeg,jpg,png}',
		//          dest: '<%= cfg.dst %>/images'
		//       }]
		//    }
		// },

		// concat: {
		//  dist: {}
		// },


		// Mocha testing framework cfguration options
		// mocha: {
		// 	all: {
		// 		options: {
		// 			run: true,
		// 			urls: ['http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/index.html']
		// 		}
		// 	 }
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
	//  GRUNT REGISTER TASKS  
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

	grunt.registerTask('default', [
		//'newer:eslint',
		'build',
		'test'
	]);// End register task :: default

	// This is the default Grunt task if you simply run "grunt" in project dir
	grunt.registerTask('build', [
		'clean:dist',
		'sass', // to be replaced by 'concurrent:dist',
		'postcss',
		'cssmin',
		'uglify',

		// stuff after this task happens in the destination folder
		'copy:dist',		
		'filerev',
		'usemin',
		'htmlmin'

	//   // 'wiredep',     // turn on only when bower-components is reinstated
	//   // 'useminPrepare',  // throws processing a template error ('test' is undefined)
	//   'concurrent:dist',
		
	//   'concat',
	//   'cssmin',		
	]);// End register task :: build

	grunt.registerTask(
		'server',['express', 'watch']
	);

	grunt.registerTask('watch:dev', [
		'watch',
		// 'ftp-deploy'
		'ftpush:dev'
	]);

	grunt.registerTask('watch:live', [
		'watch',
		'ftpush:live'
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


	//
	// LOAD NPM TASKS
	//
	// Once installed with "npm install <TASK_NAME> --save-dev",
	// we have to enable them!
	//
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-ftp-deploy');		// bulk upload
	grunt.loadNpmTasks('grunt-sftp-deploy');	// bulk upload
	grunt.loadNpmTasks('grunt-ftpush');			// granular upload
	grunt.loadNpmTasks('grunt-express');  		// Express server/livereload
	

};// End module.exports
