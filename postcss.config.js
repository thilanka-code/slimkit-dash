const purgecss = require("@fullhuman/postcss-purgecss")({
    content: ["./public/**/*.html", "./src/**/*.svelte", "./node_modules/@slimkit-ui/svelte-elements/src/**/*.svelte"],
    // content: ["./public/**/*.html", "**/**/*.svelte"], //filtering all svelte maybe inefficient!

whitelistPatterns: [/svelte-/, /fa-icon/], //Svelte compiler adds these prefixes. We won't mess with it!

    defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
})

const dev = process.env.ROLLUP_WATCH

module.exports = {
    plugins: [...(!dev ? [purgecss] : [])], //We are only purging in prod builds
}