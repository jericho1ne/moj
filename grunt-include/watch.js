/**
 * @file watch.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	dist: {
		files: ['<%= cfg.src %>/**/{,*/}*.*'],
		tasks: [
			'build:dev', 
			//'pushtodev'
		]
	},
	gruntfile: {
		// options: {livereload: true},
		files: ['Gruntfile.js'],
		tasks: ['build:dev']
	},
	// cssfiles: {
	// 	// options: {livereload: true},
	// 	files: ['<%= cfg.src %>/styles/{,*/}*.{scss,sass}'],
	// 	tasks: [
	// 		'clean:cssfiles', 
	// 		'sass', 
	// 		'postcss', 
	// 		'cssmin', 
	// 		'copy:cssfiles', 
	// 		'filerev:cssfiles', 
	// 		'usemin', 
	// 		'htmlmin'
	// 	]
	// },
	// jsfiles: {
	// 	// options: {livereload: true},
	// 	files: [
	// 		'<%= cfg.src %>/index.html', 
	// 		'<%= cfg.src %>/scripts/ui/*', 
	// 		'<%= cfg.src %>/scripts/common/*.js', 
	// 		'<%= cfg.src %>/scripts/*.js'
	// 	],
	// 	tasks: [
	// 		'clean:jsfiles',
	// 		'uglify',
	// 		'copy:jsfiles',
	// 		'filerev:jsfiles',
	// 		'usemin',
	// 		'htmlmin'
	// 	]
	// },// End jsfiles subtask

	// phpfiles: {
	// 	// options: {livereload: true},
	// 	files: [
	// 		'<%= cfg.src %>/scripts/api/*.php', 
	// 		'<%= cfg.src %>/scripts/common/*.php', 
	// 	],
	// 	tasks: ['clean:phpfiles', 'copy:phpfiles']
	// }// End corefiles subtask
};
