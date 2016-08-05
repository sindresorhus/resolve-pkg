'use strict';
var path = require('path');
var resolveFrom = require('resolve-from');

module.exports = function (moduleId, opts) {
	opts = opts || {};

	var parts = moduleId.split(path.sep);
	var packageName = '';

	if (parts.length > 0 && parts[0].indexOf('@') === 0) {
		packageName += parts.shift() + path.sep;
	}

	packageName += parts.shift();

	var pkg = path.join(packageName, 'package.json');
	var resolved = resolveFrom(opts.cwd || '.', pkg);

	if (!resolved) {
		return null;
	}

	return path.join(path.dirname(resolved), parts.join(path.sep));
};
