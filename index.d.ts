export type Options = {
	/**
	Directory to resolve from.

	@default process.cwd()
	*/
	readonly cwd?: string;
};

/**
Resolve the path of a package regardless of it having an entry point.

@param moduleId - What you would use in `import`.
@returns The resolved path, or `undefined` if the package can't be found.

@example
```
import resolvePackage from 'resolve-pkg';

// $ npm install --save-dev grunt-svgmin

resolvePackage('grunt-svgmin/tasks', {cwd: import.meta.dirname});
//=> '/Users/sindresorhus/unicorn/node_modules/grunt-svgmin/tasks'

// Fails here as Grunt tasks usually don't have a defined entry point
import.meta.resolve('grunt-svgmin/tasks');
//=> Error
```
*/
export default function resolvePackage(
	moduleId: string,
	options?: Options
): string | undefined;
