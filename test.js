import path from 'path';
import test from 'ava';
import fn from './';

test(t => {
	t.is(fn('nonexistent'), null);
	t.is(fn('nonexistent/foo'), null);
	t.is(path.relative('.', fn('grunt-svgmin')), 'node_modules/grunt-svgmin');
	t.is(path.relative('.', fn('grunt-svgmin/tasks')), 'node_modules/grunt-svgmin/tasks');
	t.is(path.relative('.', fn('@someprivate/module-test')), 'node_modules/@someprivate/module-test');
	t.is(path.relative('.', fn('@someprivate/module-test/subdir')), 'node_modules/@someprivate/module-test/subdir');
});
