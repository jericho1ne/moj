/**
 * @file ftpush.js
 * @author Mihai Peteu <mihai.peteu@gmail.com>
 * @copyright 2015 Middle of June.  All rights reserved.
 */
'use strict';
module.exports = {
	dev: {
		auth: {
			host: 'sol.apisnetworks.com',
			port: 21,
			authKey: 'apisnetworks-key'
		},
		src: '<%= cfg.dst %>',
		dest: '/var/www/html/middleofjune/dev/',
		exclusions: [
			'scripts/vendor/**/*',
			'styles/fa/**/*',
			'styles/images/**/*',
			'styles/fonts/**/*',
			'data/**', 
			'.DS_Store', 
			'Thumbs.db', 
			'tmp' 
		],
		// keep: ['/important/images/at/server/*.jpg'],
		simple: true,
		useList: false
	},// End ftpush:dev
	live: {
		auth: {
			host: 'sol.apisnetworks.com',
			port: 21,
			authKey: 'apisnetworks-key'
		},
		src: '<%= cfg.dst %>',
		dest: '/var/www/html/middleofjune/app',
		exclusions: [
			'scripts/vendor/**/*',
			'styles/fa/**/*',
			'styles/images/**/*',
			'styles/fonts/**/*',
			'data/**', 
			'.DS_Store', 
			'Thumbs.db', 
			'tmp' 
		],
		// keep: ['/important/images/at/server/*.jpg'],
		simple: true,
		useList: false
	}// End ftppush:live
};
