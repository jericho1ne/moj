/**
 * @file copy.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	all: {
		// BRO. IF ANYTHING IS MISSING IN app, ADD IT TO src BELOW.
		files: [{
			expand: true,
			dot: true,
			mode: true,
			cwd: '<%= cfg.src %>',
			dest: '<%= cfg.dst %>',
			src: [
				'{,*/}*.html',
				'scripts/**/*.{js,php}',
				'admin/**/*.{js,php}',
				'data/**/*',
				'*.{ico,png,txt}',
				'media/images/**/*.{gif,jpeg,jpg,png}',
				'media/backgrounds/**/*.{gif,jpeg,jpg,png}',
				'media/svg/**/*',
				'styles/fonts/{,*/}*.*',
				'styles/fa/{,*/}*.*',
				'styles/images/**/*.{gif,jpeg,jpg,png}',
				'styles/**/*.css',
				'styles/**/*.map'
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
				'styles/**/*.css',
				'styles/**/*.map'
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
				'scripts/common/*.php',
				'admin/*.php'
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
