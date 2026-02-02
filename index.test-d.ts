import {expectType} from 'tsd';
import resolvePackage from './index.js';

expectType<string | undefined>(resolvePackage('hello'));
expectType<string | undefined>(resolvePackage('hello', {cwd: '.'}));
