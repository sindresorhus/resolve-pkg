import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {findUpSync} from 'find-up-simple';

function isBarePackageName(packageName) {
	return Boolean(packageName) && packageName[0] !== '.';
}

function resolveIfExists(require, moduleId) {
	try {
		return require.resolve(moduleId);
	} catch {}
}

function readPackageName(directory) {
	try {
		const packageJson = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
		return packageJson.name;
	} catch {}
}

function findPackageDirectory(require, packageName, cwd) {
	const packageJsonPath = resolveIfExists(require, path.join(packageName, 'package.json'));
	if (packageJsonPath) {
		return path.dirname(packageJsonPath);
	}

	const resolvedModule = resolveIfExists(require, packageName);
	if (resolvedModule && path.isAbsolute(resolvedModule)) {
		const nodeModulesPackagePath = path.join('node_modules', ...packageName.split('/'));
		let directory = path.dirname(resolvedModule);

		while (true) {
			if (directory.endsWith(nodeModulesPackagePath) || readPackageName(directory) === packageName) {
				return directory;
			}

			const parentDirectory = path.dirname(directory);
			if (parentDirectory === directory) {
				break;
			}

			directory = parentDirectory;
		}
	}

	const packageJsonPathFromNodeModules = findUpSync(path.join('node_modules', ...packageName.split('/'), 'package.json'), {cwd});
	return packageJsonPathFromNodeModules && path.dirname(packageJsonPathFromNodeModules);
}

export default function resolvePackage(moduleId, {cwd = process.cwd()} = {}) {
	const parts = moduleId.replaceAll('\\', '/').split('/');
	let packageName = parts.shift();

	if (packageName?.[0] === '@') {
		const subPackageName = parts.shift();
		if (!subPackageName) {
			return;
		}

		packageName = `${packageName}/${subPackageName}`;
	}

	if (!isBarePackageName(packageName)) {
		return;
	}

	const require = createRequire(path.resolve(cwd, 'noop.js'));
	const packageDirectory = findPackageDirectory(require, packageName, cwd);
	if (!packageDirectory) {
		return;
	}

	return path.join(packageDirectory, ...parts);
}
