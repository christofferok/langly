'use strict';
const Config = require('electron-config');

module.exports = new Config({
	defaults: {
		lastWindowState: {
			width: 800,
			height: 600
		},
		saveIndentation: 2,
		sortKeysOnSave: true,
		baseLanguage: 'en',
		functionSearch: ['__']
	}
});