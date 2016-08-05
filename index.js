'use strict';
var path = require('path');
var resolveFrom = require('resolve-from');

module.exports = function (moduleId, opts) {
	opts = opts || {};

	var parts = moduleId.replace(/\\/g, '/').split('/');
	var packageName = '';

	// handle scoped package name
	if (parts.length > 0 && parts[0][0] === '@') {
		packageName += parts.shift() + '/';
	}

	packageName += parts.shift();

	var pkg = path.join(packageName, 'package.json');
	var resolved = resolveFrom(opts.cwd || '.', pkg);

	if (!resolved) {
		return null;
	}

	return path.join(path.dirname(resolved), parts.join('/'));
};
