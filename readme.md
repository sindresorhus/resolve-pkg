# resolve-pkg

> Resolve the path of a package regardless of it having an entry point

Some packages like CLI tools and Grunt tasks don't have an entry point defined in package.json, resulting in them not being resolvable by `import.meta.resolve()`. Unlike `import.meta.resolve()`, this package also resolves packages without an entry point and returns `undefined` instead of throwing when the package can't be found.

## Install

```sh
npm install resolve-pkg
```

## Usage

```js
import resolvePackage from 'resolve-pkg';

// $ npm install --save-dev grunt-svgmin

resolvePackage('grunt-svgmin/tasks', {cwd: import.meta.dirname});
//=> '/Users/sindresorhus/unicorn/node_modules/grunt-svgmin/tasks'

// Fails here as Grunt tasks usually don't have a defined entry point
import.meta.resolve('grunt-svgmin/tasks');
//=> Error
```

## API

### resolvePackage(moduleId, options?)

#### moduleId

Type: `string`

What you would use in `import`.

#### options

##### cwd

Type: `string`<br>
Default: `process.cwd()`

Directory to resolve from.

## Related

- [resolve-cwd](https://github.com/sindresorhus/resolve-cwd) - Resolve the path of a module from the current working directory
- [resolve-from](https://github.com/sindresorhus/resolve-from) - Resolve the path of a module from a given path
- [resolve-global](https://github.com/sindresorhus/resolve-global) - Resolve the path of a globally installed module
- [import-from](https://github.com/sindresorhus/import-from) - Import a module from a given path
- [import-cwd](https://github.com/sindresorhus/import-cwd) - Import a module from the current working directory
- [import-lazy](https://github.com/sindresorhus/import-lazy) - Import a module lazily
