/**
 * @file copy.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	dist: {
		files: [{
			expand: true,
			dot: true,
			cwd: '<%= cfg.src %>',
			dest: '<%= cfg.dst %>',
			src: [
				'{,*/}*.html',
				'scripts/**/*.{js,php}',
				'data/**/*',
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
				'/*.html',
				'scripts/*.js',
				'scripts/common/*.js',
				'scripts/ui/*.js'
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
	}// End copy:htmlfiles
};
