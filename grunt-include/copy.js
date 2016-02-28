/**
 * @file copy.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	all: {
		files: [{
			expand: true,
			dot: true,
			mode: true,
			cwd: '<%= cfg.src %>',
			dest: '<%= cfg.dst %>',
			src: [
				'{,*/}*.html',
				'scripts/**/*.{js,php}',
				'data/**/*',
				'*.{ico,png,txt}',
				'media/images/**/*.{gif,jpeg,jpg,png}',
				'styles/fonts/{,*/}*.*',
				'styles/fa/{,*/}*.*',
				'styles/images/**/*.{gif,jpeg,jpg,png}',
				'styles/**/*.css'
			]// End src
		}]// End copy:dist - files
	},// End copy:dist

	cssfiles: {
		files: [{
			expand: true,
			dot: true,
			mode: true,
			cwd: '<%= cfg.src %>',
			dest: '<%= cfg.dst %>',
			src: [
				'styles/fonts/{,*/}*.*',
				'styles/fa/{,*/}*.*',
				'styles/images/**/*.{gif,jpeg,jpg,png}',
				'styles/**/*.css'
			]// End src
		}]// End copy:dist - files
	},// End copy:dist

	jsfiles: {
		files: [{
			expand: true,
			dot: true,
			mode: true,
			cwd: '<%= cfg.src %>',
			dest: '<%= cfg.dst %>',
			src: [
				'*.html',
				'scripts/**/*.js'
			]
		}]// End copy:jsfiles - files
	},// End copy:jsfiles

	phpfiles: {
		files: [{
			expand: true,
			dot: true,
			mode: true,
			cwd: '<%= cfg.src %>',
			dest: '<%= cfg.dst %>',
			src: [
				'scripts/api/*.php',
				'scripts/common/*.php'
			]
		}]// End copy:phpfiles - files
	},// End copy:phpfiles

	htmlfiles: {
		expand: true,
		dot: true,
		mode: true,
		cwd: '<%= cfg.src %>',
		dest: '<%= cfg.dst %>',
		files: [{
			src: [
				'**/*.html'
			]
		}]// End copy:htmlfiles - files
	}// End copy:htmlfiles
};
