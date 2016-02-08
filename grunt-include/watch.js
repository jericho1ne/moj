/**
 * @file watch.js
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
	// jsfiles: {
	// 	files: ['<%= cfg.src %>/scripts/ui/*', '<%= cfg.src %>/scripts/common/*', '<%= cfg.src %>/scripts/*.js'],
	// 	tasks: ['clean:jsfiles', 'uglify', 'copy:jsfiles', 'filerev', 'usemin', 'htmlmin' ]
	// }, 
	gruntfile: {
		options: {livereload: true},
		files: ['Gruntfile.js'],
		tasks: ['build']
	},
	sass: {
		options: {livereload: true},
		files: ['<%= cfg.src %>/styles/{,*/}*.{scss,sass}'],
		tasks: [
			'clean:maincss', 
			'sass', 
			'postcss', 
			'cssmin', 
			'copy:dist', 
			'filerev', 
			'usemin', 
			'htmlmin'
		]
	},
	jsfiles: {
		options: {livereload: true},
		files: [
			'<%= cfg.src %>/index.html', 
			'<%= cfg.src %>/scripts/ui/*', 
			'<%= cfg.src %>/scripts/common/*.js', 
			'<%= cfg.src %>/scripts/*.js'
		],
		tasks: [
			'clean:jsfiles',
			'uglify',
			'copy',
			'filerev',
			'usemin',
			'htmlmin'
		]
	},// End jsfiles subtask

	phpfiles: {
		options: {livereload: true},
		files: [
			'<%= cfg.src %>/scripts/api/*.php', 
			'<%= cfg.src %>/scripts/common/*.php', 
		],
		tasks: ['copy:phpfiles']
	}// End corefiles subtask
};
