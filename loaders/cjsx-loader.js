/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Authors: Jiri Sifalda @jsifalda, Tobias Koppers @sokra
 */
var coffee      = require('coffee-react'),
    loaderUtils = require('loader-utils');

module.exports = function (source) {
    var result, map, coffee_req, js_req, query, err, code_line, offending_char;
    
    this.cacheable && this.cacheable();
    
    coffee_req  = loaderUtils.getRemainingRequest(this);
    js_req      = loaderUtils.getCurrentRequest(this);
    query       = loaderUtils.parseQuery(this.query);
    
    try {
        result = coffee.compile(source, {
            literate        : query.literate,
            filename        : coffee_req,
            debug           : this.debug,
            bare            : true,
            sourceMap       : true,
            sourceRoot      : '',
            sourceFiles     : [ coffee_req ],
            generatedFile   : js_req
        });
    } catch (e) {
        err = '';

        if (e.location == null || e.location.first_column == null || e.location.first_line == null) {
            err += 'Got an unexpected exception from the coffee-script compiler. The original exception was: ' + e +
                    '\n';
            err +=
                    '(The coffee-script compiler should not raise *unexpected* exceptions. You can file this error as an issue of the coffee-script compiler: https://github.com/jashkenas/coffee-script/issues)\n';
        } else {
            code_line = source.split('\n')[e.location.first_line];
            offending_char = e.location.first_column < code_line.length ?
                                code_line[e.location.first_column] : '';

            err += e + '\n';
            // log erroneous line and highlight offending character
            err += '    L' + e.location.first_line + ': ' + code_line.substring(0, e.location.first_column) +
                    offending_char + code_line.substring(e.location.first_column + 1) + '\n';
            err += '         ' + (new Array(e.location.first_column + 1).join(' ')) + '^\n';
        }

        throw new Error(err);
    }
    
    map = JSON.parse(result.v3SourceMap);
    map.sourcesContent = [ source ];
    
    this.callback(null, result.js, map);
};