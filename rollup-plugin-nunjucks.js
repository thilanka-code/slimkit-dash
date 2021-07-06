import nunjucks from 'nunjucks';
import { resolve } from 'path';
import fs from 'fs';

const actualPath = (path) => {
    return resolve(path);
};

/**This preprocessor will read a given .svelte file and run through Nunjucks
 *  { input: './src/App.svelte, vars: {ie11: true}'}
 */
export function preprocessNunjucks({
    input,
    vars = {},
    opts = {},
}) {

    function processNunjucks(content, filename) {

        // if (actualPath(input) != filename) return { code: content };
        if (actualPath(input) != filename) return;

        nunjucks.configure(opts);

        const environment = new nunjucks.Environment();
        const code = environment.renderString(content, {
            ...vars
        });

        // console.log(code);
        return { code };
    }

    return {
        script: ({ content, filename }) => {
            return processNunjucks(content, filename);
        },
        markup: ({ content, filename }) => {
            return processNunjucks(content, filename);
        },
        styles: ({ content, filename }) => {
            return processNunjucks(content, filename);
        }
    }
}

/**This preprocessor will read a given js file and run through Nunjucks */
export function nunjucksJsFiles({
    input,
    vars = {},
    opts = {},
}) {
    return {
        name: 'nunjucks-js-files', // this name will show up in warnings and errors

        resolveId(source) {

            if (actualPath(source) === actualPath(input)) {
                return source; // this signals that rollup should not ask other plugins or check the file system to find this id
            }
            return null; // other ids should be handled as usually
        },
        transform(code, id) {
            if (id === actualPath(input)) {

                nunjucks.configure(opts);

                const environment = new nunjucks.Environment();
                const renderedCode = environment.renderString(code, {
                    ...vars
                });

                // console.log(`Rendered Code: ${renderedCode}`);

                return renderedCode; // the source code for "virtual-module"
            }
            return null; // other ids should be handled as usually
        }
    };
}

/**
 * This rollup plugin can be used to process any file (js/html)
 */
export function nunjucksHtmlAndGnericFiles({
    input,
    vars = {},
    opts = {},
    hook = 'buildStart'
}) {
    return {
        name: 'nunjucks-html-and-generic',
        [hook]: async () => {
            const actualPathIn = actualPath(input);
            const templateContent = await fs.promises.readFile(actualPathIn, 'utf-8', {flage: 'r'});
            nunjucks.configure(opts);
            
            const environment = new nunjucks.Environment();
            const renderedCode = environment.renderString(templateContent, {
                ...vars
            });

            await fs.promises.writeFile(actualPathIn, renderedCode, {flag: 'w+'});
            console.log('File written by nunjucksHtmlAndGnericFiles: '+actualPathIn);

        }
    }
}
