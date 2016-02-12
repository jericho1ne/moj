/**
 * @file filerev.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	// Renames files for browser caching purposes
	// https://www.npmjs.com/package/grunt-filerev
	options: {
		algorithm: 'md5',
		length: 4
	},
	all: {
		src: [
			'<%= cfg.dst %>/scripts/**/*.js',
			'<%= cfg.dst %>/styles/{,*/}*.css'
		]
	},
	jsfiles: {
		src: [
			'<%= cfg.dst %>/scripts/**/*.js'
		]
	},
	cssfiles: {
		src: [
			'<%= cfg.dst %>/styles/{,*/}*.css'
		]
	}
};
