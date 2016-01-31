/**
 * @file Grunt watch and related tasks
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	//js: {
	// 	files: ['<%= cfg.src %>/scripts/{,*/}*.js'],
	// 	tasks: ['babel:dist']
	//},
	// babelTest: {
	// 	files: ['test/spec/{,*/}*.js'],
	// 	tasks: ['babel:test', 'test:watch']
	// },
	gruntfile: {
		options: {livereload: true},
		files: ['Gruntfile.js'],
		tasks: ['build']
	},
	sass: {
		options: {livereload: true},
		files: ['<%= cfg.src %>/styles/{,*/}*.{scss,sass}'],
		tasks: ['clean:maincss', 'sass', 'postcss', 'cssmin']
	},
	corefiles: {
		options: {livereload: true},
		files: [
			'<%= cfg.src %>/index.html', 
			'<%= cfg.src %>/templates/**',
			'<%= cfg.src %>/scripts/ui/*', 
			'<%= cfg.src %>/scripts/common/*', 
			'<%= cfg.src %>/scripts/*.js'
		],
		tasks: ['build', 'ftpush:build']
	},
	// jsfiles: {
	// 	files: ['<%= cfg.src %>/scripts/ui/*', '<%= cfg.src %>/scripts/common/*', '<%= cfg.src %>/scripts/*.js'],
	// 	tasks: ['clean:jsfiles', 'uglify', 'copy:jsfiles', 'filerev', 'usemin', 'htmlmin' ]
	// }
};
