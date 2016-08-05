import path from 'path';
import test from 'ava';
import m from './';

test(t => {
	t.is(m('nonexistent'), null);
	t.is(m('nonexistent/foo'), null);
	t.is(path.relative('.', m('grunt-svgmin')), 'node_modules/grunt-svgmin');
	t.is(path.relative('.', m('grunt-svgmin/tasks')), 'node_modules/grunt-svgmin/tasks');
	t.is(path.relative('.', m('@someprivate/module-test')), 'node_modules/@someprivate/module-test');
	t.is(path.relative('.', m('@someprivate/module-test/subdir')), 'node_modules/@someprivate/module-test/subdir');
});
