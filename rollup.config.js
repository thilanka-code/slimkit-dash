import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from "rollup-plugin-css-only"; //Copy css files to public dir
import replace from '@rollup/plugin-replace';
import sveltePreprocess from 'svelte-preprocess';
import { test } from "./rollup-plugin-my-test";
import { updateServiceWorker } from "./rollup-plugin-sw";
import copy from 'rollup-plugin-copy';
import { nunjucksHtmlAndGnericFiles } from "./rollup-plugin-nunjucks.js";
import image from '@rollup/plugin-image'; //encodes images to text (33% larger than normal!)

require('dotenv').config();

const production = !process.env.ROLLUP_WATCH;
const buildType = process.env.BUILD_TYPE

console.log("Initiating build for : "+buildType);

//Determine the type of Rollup output config on buildType
let rollupOutput = buildType == 'web' ? [{
	// sourcemap: !production,
	sourcemap: true,
	format: 'es',
	name: 'app',
	dir: 'public/build/'
}] : [{
	name: 'app',
	format: 'iife',
	file: 'public/build/main.js',
	inlineDynamicImports: true
}]

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
	output: rollupOutput,
	plugins: [
		// test(),
		image(), //embed images
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
			ENV: JSON.stringify({
				API_BASE: production ? process.env.API_BASE : process.env.DEV_API_BASE
			})
		}),
		css({ output: "extra.css" }), // External (node_modules) css parser
		nunjucksHtmlAndGnericFiles({ //Inject css and js based on the build type
			input: './public/index.html',
			vars: { build: buildType },
			hook: 'buildEnd'
		}),
		svelte({
			//Disable warnings for fast builds.
			onwarn: (warning, handler) => {
				const { code, frame } = warning;
				if (code === "css-unused-selector")
					return;
		
				handler(warning);
			},
			preprocess: [
				sveltePreprocess({
					defaults: {
						style: 'scss',
					},
					scss: {
						prependData: 
						`@import 'src/styles/variables.scss';`, //Customize bulma colors
					},
					postcss: production // To enable purging unused css
				}),

			], 
			
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

		updateServiceWorker(),

		copy({
			targets: [{
				src: 'service-worker.js',
				dest: 'public',
				transform: (contents) => {
					return contents.toString().replace('__MAIN_CHUNK__', global.mainFileName);
				}
			}],
			hook: 'renderChunk',
			verbose: true
		}),

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
