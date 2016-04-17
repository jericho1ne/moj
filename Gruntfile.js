/**
 * @file Gruntfile.js in all its greatness
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2016 Middle of June.  All rights reserved.
 */
'use strict';

module.exports = function (grunt) {
	// Time how long tasks take;  Optimizing build times!
	require('time-grunt')(grunt);

	// cfgurable paths
	var cfg = {
		src: 'src',
		dst: 'app'
	};


	// Define the cfguration for all the tasks
	grunt.initConfig({

		// Project settings
		cfg: cfg,

		// Webhost credentials
		scpConfig: grunt.file.readJSON('scp.json'),

		// Clean targeted directories to start fresh
	   	clean: require('./grunt-include/clean'),

	   	// Copies remaining files to places other tasks can use
		copy: require('./grunt-include/copy'),

		// Watches files for changes and runs tasks based on what's changed
		watch: require('./grunt-include/watch'),

		// FTP files to live / dev domain incrementally
		ftpush: require('./grunt-include/ftpush'),

		// Compile Sass to CSS
		sass: require('./grunt-include/sass'),

		// Cachebuster! - appends random alphanumeric string before file extension 
		filerev: require('./grunt-include/filerev'),

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

		// Manual css minification (usemin is not maintained)
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
				// cwd: '<%= cfg.src %>/scripts/vendor/'
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
			}// End uglify:dist
		},// End uglify task
		
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
				dest: '/var/www/html/middleofjune/dev/',
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

		// Grunt SCP file upload task
		scp: {    
			options: {
				host: '<%= scpConfig.host %>',
				username: '<%= scpConfig.username %>',
				password: '<%= scpConfig.password %>'
			},
			your_target: {
				files: [{
					cwd: '<%= cfg.src %>',
					src: [
						'media/**/*',
						'scripts/**/*', 
						'styles/*.css', 
						'templates/**/*',
						// robots.txt, index.html, png icons
						'**/*',  
		
						//'images/_grey-bg.png',
						// 'images/*',
					],
					filter: 'isFile',
					// path on the server
					dest: '<%= scpConfig.directory %>'
				}]
			},
		},// End task grunt-scp


		// Performs index.html embedded js + css rewrites 
		//	based on filerev (we don't use the useminPrepare config)
		// UNMAINTAINED - find a replacement
		usemin: {
			options: {
				assetsDirs: [
					'<%= cfg.dst %>',
					'<%= cfg.dst %>/scripts/',
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

		// Run some tasks in parallel to speed up build process
		concurrent: {
			target1: [
				'copy',
				'cssmin',
				'uglify'
				// 'imagemin'
				// 'svgmin'
			],
			target2: [
				'usemin',
				'htmlmin'
			]
		},

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



	});// End grunt initcfg

	grunt.registerTask('default', [
		//'newer:eslint',
		'build',
		'test'
	]);// End register task :: default

	// This is the default Grunt task if you simply run "grunt" in project dir
	grunt.registerTask('build', [
		'clean:all',
		'sass', // to be replaced by 'concurrent:dist',
		'postcss',
		'cssmin',
		'uglify',
		
		// stuff after this task happens in the destination folder
		'copy:all',		
		'filerev:all',
		'usemin',
		'htmlmin'
	]);// End register task :: build


	grunt.registerTask('scp', ['scp']);

	grunt.registerTask('pushtodev', ['build', 'ftpush:dev']);

	grunt.registerTask('pushtolive', ['build', 'ftpush:live']);

	grunt.registerTask('default', ['concurrent:target1'], ['concurrent:target2']);

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
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-ftp-deploy');		// bulk upload
	grunt.loadNpmTasks('grunt-sftp-deploy');	// bulk upload
	grunt.loadNpmTasks('grunt-ftpush');			// granular upload
	grunt.loadNpmTasks('grunt-scp');			// SCP/SSH file upload
	grunt.loadNpmTasks('grunt-express');  		// Express server/livereload

};// End module.exports
