import path from 'node:path';
import test from 'ava';
import resolvePackage from './index.js';

test('main', t => {
	t.is(resolvePackage('nonexistent'), undefined);
	t.is(resolvePackage('nonexistent/foo'), undefined);
	t.is(path.relative('.', resolvePackage('grunt-svgmin')), 'node_modules/grunt-svgmin');
	t.is(path.relative('.', resolvePackage('grunt-svgmin/tasks')), 'node_modules/grunt-svgmin/tasks');
	t.is(path.relative('.', resolvePackage('@someprivate/module-test')), 'node_modules/@someprivate/module-test');
	t.is(path.relative('.', resolvePackage('@someprivate/module-test/subdir')), 'node_modules/@someprivate/module-test/subdir');
	t.is(path.relative('.', resolvePackage('is-safe-filename')), 'node_modules/is-safe-filename');
});
