import path from 'path';
import test from 'ava';
import resolvePkg from '.';

test('main', t => {
	t.is(resolvePkg('nonexistent'), undefined);
	t.is(resolvePkg('nonexistent/foo'), undefined);
	t.is(path.relative('.', resolvePkg('grunt-svgmin')), 'node_modules/grunt-svgmin');
	t.is(path.relative('.', resolvePkg('grunt-svgmin/tasks')), 'node_modules/grunt-svgmin/tasks');
	t.is(path.relative('.', resolvePkg('@someprivate/module-test')), 'node_modules/@someprivate/module-test');
	t.is(path.relative('.', resolvePkg('@someprivate/module-test/subdir')), 'node_modules/@someprivate/module-test/subdir');
});
