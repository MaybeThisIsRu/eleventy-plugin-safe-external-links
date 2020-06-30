/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This file has been modified by Ru Singh.
 * Notice in accordance with the Apache 2.0 license.
 */

const cheerio = require('cheerio');
const path = require('path');

/**
 * HOP - Has Own Property
 *
 * @param {object} obj - Object to test
 * @param {string} prop - The name of the property to test for
 * @param {*} fallback - The fallback if that property isn't found
 *
 * @return {*} Either the property from that object, if found or the fallback
 */
function hop(obj, prop, fallback) {
  return Object.prototype.hasOwnProperty.call(obj, prop) ? obj[prop] : fallback;
}

/**
 *
 * @param {object} config
 * @return {function}
 */
function safeExternalLinksSetup(config = {}) {
  const pattern = new RegExp(config.pattern || 'https{0,1}://');
  const noopener = hop(config, 'noopener', true);
  const noreferrer = hop(config, 'noreferrer', false);
  const files = config.files || ['.html'];

  /**
   * @param {string} content
   * @param {string} outputPath
   * @return {string}
   */
  return function safeExternalLinks(content, outputPath) {
    if (!outputPath || outputPath === false) return content;

    const ext = path.extname(outputPath);

    if (!files.includes(ext)) return content;

    try {
      const $ = cheerio.load(content, { _useHtmlParser2: true });
      const links = $('a').get();

      if (links.length) {
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          const href = $(link).attr('href');
          // const target = $(link).attr('target');
          let rel = $(link).attr('rel');

          rel = rel ? rel.split(' ') : [];

          if (pattern.test(href)) {
            if (noopener) {
              rel.push('noopener');
              $(link).attr('target', '_blank');
            } else {
              // Even if user says not to add noopener, add _blank target to existing noopener links
              if (rel.length && rel.includes('noopener')) {
                $(link).attr('target', '_blank');
              }
            }

            if (noreferrer) {
              rel.push('noreferrer');
            }

            if (rel.length) {
              $(link).attr('rel', rel.join(' '));
            }

            $(link).replaceWith($.html(link));
          }
        }

        return $.html();
      }
    } catch (e) {
      // console.error(e);
    }

    return content;
  };
}

module.exports = safeExternalLinksSetup;
