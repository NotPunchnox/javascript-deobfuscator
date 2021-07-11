const fs = require('fs'),
    beautifier = require('js-beautify').js

wrapchain = function (str) {
    if (str.includes('\n') || (str.includes('"') && str.includes("'"))) return '`'
    return !str.includes("'") ? "'" : '"'
}

function decode(source, options) {
    let s = source.match(/^(var|const|let)\s+((?![^_a-zA-Z$])[\w$]*)\s*=\s*\[.*?\];/)

    if (!s || s.length !== 3) throw 'Not matched'

    const var_ = s[2],
        key = new RegExp(var_.replace(/\$/g, '\\$') + '\\[(\\d+)\\]', 'g')
    let result = source.replace(/^(var|const|let)\s+((?![^_a-zA-Z$])[\w$]*)\s*=\s*\[.*?\];/, '')

    s = s[0].replace(/[\s\S]*?\[/, '[')
    s = eval(s)


    result = result.split(';')
    result = result.map((p) =>
        p.replace(key, function (_, index) {
            const item = s[index],
                q = wrapchain(item)

            return q + item.replace(new RegExp('[\\\\' + q + '\\n]', 'g'), '\\$&').replace(/-/g, '\\x2d') + q
        })
    )
    result = result.join(';')
    result = result.replace(/(?<=(\b(return|throw|in|of|new|delete|default|function|async|await|get|set)|\{|\*))\s*\[('|")((?![^_a-zA-Z$])[\w$]*)\3\]\s*\(/g,' $4( ')
    result = result.replace(/(?<=((?![^_a-zA-Z$])[\w$]*)|\]|\))\[('|")((?![^_a-zA-Z$])[\w$]*)\2\]/gi, ' .$3 ')

    return {
        input: source,
        output: result
    }
}

console.clear()
console.log('\x1b[36mPlease wait...\x1b[0m')
fs.writeFileSync('./output/result.js', beautifier(decode(fs.readFileSync('input.js', 'utf8')).output))
console.log('\x1b[32mFinished! look in the file \\output\\result.js\x1b[0m')