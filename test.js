import path from 'node:path';
import test from 'ava';
import resolvePackage from './index.js';

function resolveRelativePackagePath(moduleId, options) {
	const packagePath = resolvePackage(moduleId, options);
	if (!packagePath) {
		return;
	}

	return path.relative('.', packagePath);
}

test('main', t => {
	t.is(resolvePackage('nonexistent'), undefined);
	t.is(resolvePackage('nonexistent/foo'), undefined);
	t.is(resolveRelativePackagePath('grunt-svgmin'), 'node_modules/grunt-svgmin');
	t.is(resolveRelativePackagePath('grunt-svgmin/tasks'), 'node_modules/grunt-svgmin/tasks');
	t.is(resolveRelativePackagePath('@someprivate/module-test'), 'node_modules/@someprivate/module-test');
	t.is(resolveRelativePackagePath('@someprivate/module-test/subdir'), 'node_modules/@someprivate/module-test/subdir');
	t.is(resolveRelativePackagePath('is-safe-filename'), 'node_modules/is-safe-filename');
	t.is(resolveRelativePackagePath('grunt-svgmin/'), 'node_modules/grunt-svgmin');
});

test('resolves aliased packages', t => {
	// Simulates `npm install aliased-pkg@npm:original-pkg-name` where the
	// directory name differs from the `name` field in package.json.
	t.is(resolveRelativePackagePath('aliased-pkg'), 'node_modules/aliased-pkg');
	t.is(resolveRelativePackagePath('aliased-pkg/subdir'), 'node_modules/aliased-pkg/subdir');
});

test('resolves ESM-only packages', t => {
	// Package with exports only having an `import` condition (no `require`/`default`).
	t.is(resolveRelativePackagePath('esm-only-pkg'), 'node_modules/esm-only-pkg');
	t.is(resolveRelativePackagePath('esm-only-pkg/subdir'), 'node_modules/esm-only-pkg/subdir');
});

test('does not resolve relative specifiers', t => {
	t.is(resolvePackage('..'), undefined);
	t.is(resolvePackage('../foo'), undefined);
	t.is(resolvePackage('./foo'), undefined);
});

test('resolves self-referenced packages', t => {
	t.is(resolveRelativePackagePath('resolve-pkg'), '');
	t.is(resolveRelativePackagePath('resolve-pkg/index.js'), 'index.js');
});

test('does not resolve invalid bare specifiers', t => {
	for (const moduleId of ['', '.', '/', '/tmp/test.js', '@someprivate', '@someprivate/', '@/name', '@someprivate/..', './grunt-svgmin', String.raw`..\foo`]) {
		t.is(resolvePackage(moduleId), undefined);
	}
});

test('resolves module IDs with Windows separators', t => {
	t.is(resolveRelativePackagePath(String.raw`@someprivate\module-test`), 'node_modules/@someprivate/module-test');
	t.is(resolveRelativePackagePath(String.raw`grunt-svgmin\tasks`), 'node_modules/grunt-svgmin/tasks');
	t.is(resolveRelativePackagePath(String.raw`@someprivate\module-test\subdir`), 'node_modules/@someprivate/module-test/subdir');
});

test('resolves package roots from nested cwd', t => {
	t.is(resolveRelativePackagePath('grunt-svgmin', {cwd: path.join('.', 'fixtures', 'private-module-test')}), 'node_modules/grunt-svgmin');
});

test('resolves package root when entry point is in a nested package.json directory', t => {
	t.is(resolveRelativePackagePath('nested-package-json-pkg'), 'node_modules/nested-package-json-pkg');
	t.is(resolveRelativePackagePath('nested-package-json-pkg/subpath'), 'node_modules/nested-package-json-pkg/subpath');
});
