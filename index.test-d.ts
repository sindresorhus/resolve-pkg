import {expectType} from 'tsd';
import resolvePkg = require('.');

expectType<string | undefined>(resolvePkg('hello'));
expectType<string | undefined>(resolvePkg('hello', {cwd: '.'}));
