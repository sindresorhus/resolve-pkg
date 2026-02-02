import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
import {createRequire} from 'node:module';

function findPackageDirectory(require, packageName) {
	// Try resolving package.json directly (works when `exports` doesn't block it)
	try {
		return path.dirname(require.resolve(path.join(packageName, 'package.json')));
	} catch {}

	// For packages with `exports` that don't expose `./package.json`,
	// resolve the package entry point and walk up to find the package root.
	let resolved;
	try {
		resolved = require.resolve(packageName);
	} catch {
		return;
	}

	let directory = path.dirname(resolved);
	const {root} = path.parse(directory);

	while (directory !== root) {
		const packageJsonPath = path.join(directory, 'package.json');
		if (fs.existsSync(packageJsonPath)) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
			if (packageJson.name === packageName) {
				return directory;
			}
		}

		directory = path.dirname(directory);
	}
}

export default function resolvePackage(moduleId, {cwd = process.cwd()} = {}) {
	const parts = moduleId.replaceAll('\\', '/').split('/');
	let packageName = '';

	// Handle scoped package name
	if (parts.length > 0 && parts[0][0] === '@') {
		packageName += parts.shift() + '/';
	}

	packageName += parts.shift();

	const require = createRequire(path.resolve(cwd, 'noop.js'));

	const packageDirectory = findPackageDirectory(require, packageName);
	if (!packageDirectory) {
		return;
	}

	return path.join(packageDirectory, ...parts);
}
