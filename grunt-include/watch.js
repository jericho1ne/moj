/**
 * @file Grunt watch and related tasks
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	// babel: {
	// 	files: ['<%= cfg.app %>/scripts/{,*/}*.js'],
	// 	tasks: ['babel:dist']
	// },
	// babelTest: {
	// 	files: ['test/spec/{,*/}*.js'],
	// 	tasks: ['babel:test', 'test:watch']
	// },
	// gruntfile: {
	// 	files: ['Gruntfile.js']
	// },
	// sass: {
	// 	files: ['<%= cfg.app %>/styles/{,*/}*.{scss,sass}'],
	// 	tasks: ['sass', 'postcss']
	// },
	styles: {
		files: ['<%= cfg.app %>/styles/{,*/}*.css'],
		tasks: ['newer:copy:styles', 'postcss']
	},
	watch: {
		files: ['**/*'],
		tasks: ['jshint']
	},
};
