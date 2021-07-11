fs = require('fs')
beautifier = require('js-beautify').js

decode = (source) ->
  s = source.match(/^(var|const|let)\s+((?![^_a-zA-Z$])[\w$]*)\s*=\s*\[.*?\];/)
  if !s or s.length != 3
    throw 'Not matched'
  key = new RegExp(s[2].replace(/\$/g, '\\$') + '\\[(\\d+)\\]', 'g')
  result = source.replace(/^(var|const|let)\s+((?![^_a-zA-Z$])[\w$]*)\s*=\s*\[.*?\];/, '')
  s = s[0].replace(/[\s\S]*?\[/, '[')
  s = eval(s)
  result = result.split(';')
  result = result.map (p) ->
    p.replace key, (_, index) ->
      item = s[index]
      q = wrapchain(item)
      return q + item.replace(new RegExp('[' + q + ']', 'g'), '\\$&').replace(/-/g, '\\x2d') + q
  result = result.join(';')
  result = result.replace(/(?<=(\b(return|throw|in|of|new|delete|default|function|async|await|get|set)|\{|\*))\s*\[('|")((?![^_a-zA-Z$])[\w$]*)\3\]\s*\(/g, ' $4( ')
  result = result.replace(/(?<=((?![^_a-zA-Z$])[\w$]*)|\]|\))\[('|")((?![^_a-zA-Z$])[\w$]*)\2\]/gi, ' .$3 ')
  {
    input: source
    output: result
  }

wrapchain = (str) ->
  if str.includes('\n') or str.includes('"') and str.includes('\'')
    return '`'
  if !str.includes('\'') then '\'' else '"'

console.clear()
console.log '[36mPlease wait...[0m'
fs.writeFileSync './output/result.js', beautifier(decode(fs.readFileSync('input.js', 'utf8')).output)
console.log '[32mFinished! look in the file \\output\\result.js[0m'
