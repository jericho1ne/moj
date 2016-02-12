/**
 * @file clean.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	all: {
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
				'<%= cfg.dst %>/scripts/*.js',
				'<%= cfg.dst %>/scripts/common/*.js',
				'<%= cfg.dst %>/scripts/ui/*.js'	
			]
		}]
	},
	cssfiles: {
		files: [{
			dot: true,
			src: [
				'<%= cfg.dst %>/styles/main.css'
			]
		}]
	},
	server: '.tmp'
};
