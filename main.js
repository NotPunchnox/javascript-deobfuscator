const fs = require('fs'),
      beautifier = require('js-beautify').js

    wrapchain = function(str) {
        if(str.includes('\n') || (str.includes('"') && str.includes("'"))) return '`';
        return !str.includes("'") ? "'" : '"';
    },

    chain = function(str) {
        str = str.replace(
            /(?<=(\b(return|throw|in|of|new|delete|default|function|async|await|get|set)|\{|\*))\s*\[('|")((?![^_a-zA-Z$])[\w$]*)\3\]\s*\(/g,
            ' $4( '
        )
        str = str.replace(/(?<=((?![^_a-zA-Z$])[\w$]*)|\]|\))\[('|")((?![^_a-zA-Z$])[\w$]*)\2\]/gi, ' .$3 ');
        return str;
    },

    reg = function(str, q) {
      return str.replace(new RegExp('[\\\\' + q + '\\n]', 'g'), '\\$&').replace(/-/g, '\\x2d')
    }

function decode(source, options) {
    const detectPattern = /^(var|const|let)\s+((?![^_a-zA-Z$])[\w$]*)\s*=\s*\[.*?\];/;
    let _var = source.match(detectPattern);

    if(!_var || _var.length !== 3) throw 'Not matched';

    const _name = _var[2],
        keyPattern = new RegExp(_name.replace(/\$/g, '\\$') + '\\[(\\d+)\\]', 'g');
    let result = source.replace(detectPattern, '');

    _var = _var[0].replace(/[\s\S]*?\[/, '[');
    _var = eval(_var);


    result = result.split(';');
    result = result.map((piece) =>
        piece.replace(keyPattern, function(key, index) {
            const item = _var[index],
                q = wrapchain(item);

            return q + reg(item, q) + q;
        })
    );
    result = result.join(';')
    result = chain(result)
    return {
        input: source,
        output: result
    };
}
console.clear()
console.log('\x1b[36mPlease wait...\x1b[0m')
fs.writeFileSync('./output/result.js', beautifier(decode(fs.readFileSync('input.js', 'utf8')).output))
console.log('\x1b[32mFinished! look in the file \\output\\result.js\x1b[0m')