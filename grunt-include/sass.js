/**
 * @file sass.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	options: {
		sourceMap: true,
		sourceMapEmbed: true,
		sourceMapContents: true,
		includePaths: ['.']
	},// End options
	dist: {
		// files: {
		// 	'<%= cfg.dst %>/styles/main.scss': '<%= cfg.dst %>/styles/main.css'
		// }			
		files: [{
			expand: true,
			cwd: '<%= cfg.src %>/styles',
			src: ['*.{scss,sass}'],
			dest: '.tmp/styles',
			ext: '.css'
		}]
	}// End dist
};
