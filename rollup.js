const path = require('path');
const glob = require('glob');
const rollup = require('rollup');
const {terser} = require('rollup-plugin-terser');

// Left here in case debugging is needed
const includeSourcemaps = false;
const srcDir = path.join(process.cwd(), '.tmp');
const buildDir = path.join(process.cwd(), 'build', 'assets', 'styleguide', 'js');

const globPattern = path.posix.join('**', '*.js');
const ignoreUnderscorePrefixPattern = path.posix.join('**', '_*.js');
const srcFiles = glob.sync(globPattern, {
    strict: true,
    cwd: srcDir,
    absolute: true,
    ignore: [ignoreUnderscorePrefixPattern]
});

console.log(`Minifying the following JavaScript files for the browser:`);
srcFiles.forEach((file) => console.log(`    ${path.relative(process.cwd(), file)}`));

let promiseChain = Promise.resolve();
srcFiles.forEach(async (srcFile) => {
    promiseChain = promiseChain.then(async () => {
        const plugins = [
            // Minify the bundled JS
            terser(),
        ];

        const bundle = await rollup.rollup({
            input: srcFile,
            plugins,
        });

        // or write the bundle to disk
        await bundle.write({
            sourcemap: includeSourcemaps,
            file: srcFile.replace(srcDir, buildDir),
        });
    }).catch((err) => {
        console.error(`Unable to minify '${srcFile}' with rollup: ${err}`);
        throw new Error(`Unable to minify '${srcFile}' with rollup: ${err.message}`);
    });
});