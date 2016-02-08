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
		dest: '/var/www/html/middleofjune/dist/',
		exclusions: [
			'<%= cfg.dst %>/scripts/vendor/**/*',
			'<%= cfg.dst %>/styles/fa/**/*',
			'<%= cfg.dst %>/styles/images/**/*',
			'<%= cfg.dst %>/styles/fonts/**/*',
			'<%= cfg.dst %>/data/**', 
			'<%= cfg.dst %>/.*', 
			'<%= cfg.dst %>/Thumbs.db', 
			'<%= cfg.dst %>/tmp' ],
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
		dest: '/var/www/html/middleofjune/',
		exclusions: [
			'<%= cfg.dst %>/scripts/vendor/**/*',
			'<%= cfg.dst %>/styles/fa/**/*',
			'<%= cfg.dst %>/styles/images/**/*',
			'<%= cfg.dst %>/styles/fonts/**/*',
			'<%= cfg.dst %>/data/*', 
			'<%= cfg.dst %>/.DS_Store', 
			'<%= cfg.dst %>/Thumbs.db', 
			'<%= cfg.dst %>/tmp' ],
		// keep: ['/important/images/at/server/*.jpg'],
		simple: true,
		useList: false
	}// End ftppush:live
};
