/*
Adapted from https://github.com/j4hr3n/gulp-prefix-css/

Copyright 2016 Christoffer Jahren

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict';

const es = require('event-stream');
const PluginError = require('plugin-error');
const postcss = require('postcss');
const PLUGIN_NAME = 'gulp-prefix-css';

module.exports = function cssPrefixer(scopeSelectorOption) {
    const scopeSelector = scopeSelectorOption;
    const nameSpaceFonts = function (inputCss) {
        const fontSuffix = "-ns";
        inputCss = inputCss.replace(/font-family:flexi-ui/g, "font-family:flexi-ui" + fontSuffix);
        inputCss = inputCss.replace(/font-family:flexi-all/g, "font-family:flexi-all" + fontSuffix);
        return inputCss;
    };

    const scope = postcss(function (css) {
        css.walkRules(function (rule) {
            rule.selectors = rule.selectors.map(function (selector) {
                if (selector.trim().toLowerCase().includes('.flexiness-root') || selector.trim().toLowerCase().includes('.is-flexiness')) {
                    return selector;
                }
                if (selector.trim().toLowerCase() === 'body' || selector.trim().toLowerCase() === 'html') {
                    return selector + scopeSelector;
                } else {
                    return scopeSelector + ' ' + selector;
                }
            });
        });
    });


    if (!scopeSelector) {
        throw new PluginError(PLUGIN_NAME, 'Missing a css prefix!');
    }

    return es.map(function (file, callback) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isBuffer()) {
            file.contents = new Buffer.from(nameSpaceFonts(scope.process(file.contents).css));
        }
        if (file.isStream()) {
            var through = es.through();
            var wait = es.wait(function (err, contents) {
                through.write(scope.process(contents).css);
                through.end();
            });

            file.contents.pipe(wait);
            file.contents = through;
        }
        callback(null, file);
    })
};
