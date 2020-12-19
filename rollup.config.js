import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from "rollup-plugin-css-only"; //Copy css files to public dir
import replace from '@rollup/plugin-replace';
import sveltePreprocess from 'svelte-preprocess';
import { test } from "./rollup-plugin-my-test";
import copy from 'rollup-plugin-copy';

require('dotenv').config();

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: 'public/build/'
	},
	plugins: [
		test(),
		copy({
			targets: [{
				src: 'public/template.index.html',
				dest: 'public',
				rename: 'index.html',
				transform: (contents) => {
					let baseRef = process.env.NODE_ENV === 'production' ? process.env.WEB_ROOT : '/';
					return contents.toString().replace('__BASE_HREF__', baseRef);
				}
			}],
			hook: 'buildStart'
		}),
		replace({
			delimiters: ['__', '__'],
			BASE_PATH: production ? process.env.BASE_URL : ''
		}),
		css({ output: "extra.css" }), // External (node_modules) css parser
		svelte({
			preprocess: sveltePreprocess({
				defaults: {
					style: 'scss',
				},
				scss: {
					prependData: 
					`@import 'src/styles/variables.scss';`, //Customize bulma colors
					// includePaths:[resolve('node_modules/bulma/'), 'src'],
					// outFile: 'public/build/scss.css'
				}
			}), 
			
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			},
			// preprocess: 
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
