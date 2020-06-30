# Eleventy Plugin Safe External Links

[Eleventy plugin](https://www.11ty.dev/docs/plugins/) ensuring that external links always contain `rel="noopener"`, `rel="noreferrer"`, which are [potentially unsafe otherwise](https://web.dev/external-anchors-use-rel-noopener/).

## Installing

```bash
npm install @hirusi/eleventy-plugin-safe-external-links
```

This has only been tested with Eleventy 0.11.0 and would ideally be kept up to date with only future releases of Eleventy.

## Usage

```js
const pluginLocalRespimg = require('eleventy-plugin-safe-external-links');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin('safe-external-links', {
      pattern: 'https{0,1}://', // RegExp pattern for external links
      noopener: true, // Whether to include noopener
      noreferrer: false, // Whether to include noreferrer
      files: [ // What output file extensions to work on
        '.html'
      ],
    },
  });
};
```
## Differences from chromeos/static-site-scaffold-modules/modules/eleventy-plugin-safe-external-links

* This is not a mono-repo. Easier to manage and release updates.
* Ignores files where `permalink` is set to `false`.
* Fixes an issue where the plugin would empty everything but the body of the page `content`. ([see issue with cheerio](https://github.com/cheeriojs/cheerio/issues/1031))
* Adds `_blank` target to external links, __unless `noopener` is set to false.__
* Adds `_blank` target to external links already carrying `noopener` rel __(ignores `noopener` option)__
* Updated tests.

## Versioning

I intend to keep this up to date with the original repo as best as I can. The patch and minor fields from the source repo would be combined - `0.1.4` would change to `0.14.0`. The patch field then would reflect my changes on top of it for that minor release - `0.14.1`.