var http = require('http');
var url = require('url');
var server = http.createServer(function(_0x941fx4, _0x941fx5) {
    var _0x941fx6 = url.parse(_0x941fx4.url).pathname;
    console.log(_0x941fx6);
    _0x941fx5.writeHead(200, {
        "\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65": 'text/plain'
    });
    _0x941fx5.write('Bonjour le monde');
    _0x941fx5.end()
});
server.listen(8080)