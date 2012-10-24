//
// phpnode is a really simple web server with support for PHP.
//
// This can be handy as an easy PHP development server. In contrast to
// PHP's built in web server phpnode can handle parallel requests due to
// node.js asynchroneous nature.
//
// Copyright (c) 2012 Philipp Wolfer <ph.wolfer@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var mime = require('mime');
var cgi = require('cgi');
var events = require('events');

var PORT = 8000;
var PHP_EXECUTABLE = 'php-cgi';
var DEFAULT_INDEX = ['index.php', 'index.html'];

function requestHandler(req, res) {
    console.log(req.method + ' ' + req.url);
    
    // We have to pause the request right away, since
    // the body data will be read in the cgi module.
    req.pause();
    var requestUrl = url.parse(req.url);
    var filePath = '.' + requestUrl.pathname;
      
    var resolver = new IndexResolver();
    resolver.on('found', function(filePath) {
	var ext = path.extname(filePath);

	if (ext == '.php') {
	    handlePhpScript(req, res, filePath);
	}
	else {
	    handleStaticFile(filePath, res);
	}
    });

    resolver.on('notFound', function() {
	res.writeHead(404);
        res.end();
    });

    resolver.resolve(filePath);
};

var IndexResolver = function(){
    events.EventEmitter.call(this);

    var that = this;

    this.resolve = function(path) {
	fs.lstat(path, function(err, stats) {
	    if (err || !stats) {
		notFound();
		return;
	    }

	    if (stats.isFile()) {
		found(path);
	    }
	    else if (stats.isDirectory()) {
		findDirectoryIndex(path);
	    }
	    else {
		notFound();
	    }
	});
    }

    function findDirectoryIndex(path) {
	// We use synchronous requests here to avoid a too deep callstack.
	for (var i = 0; i < DEFAULT_INDEX.length; i++) {
	    var filePath = path + '/' + DEFAULT_INDEX[i];
	    
	    try {
		var stats = fs.lstatSync(filePath);
	    
		if (stats.isFile()) {
		    console.log('Using index file ' + filePath);
		    found(filePath);
		    return;
		}
	    }
	    catch (err) {
		console.log('No index file ' + filePath);
	    }
	}

	notFound();
    }

    function found(filePath) {
	that.emit('found', filePath);
    }

    function notFound() {
	that.emit('notFound');
    }
};
require('util').inherits(IndexResolver, events.EventEmitter);

function handleStaticFile(filePath, res) {
    var contentType = mime.lookup(filePath);
    console.log('Serving ' + filePath + ' (' + contentType + ')');
    
    fs.lstat(filePath, function(err, stats) {
	if (stats.isDirectory()) {
	    filePath += '/' + 'index.html';
	}

	fs.readFile(filePath, function(error, content) {
            if (error) {
		res.writeHead(500);
		res.end();
            }
            else {
		res.writeHead(200, { 'Content-Type': contentType });
		res.end(content);
            }
	});
    });
}

function handlePhpScript(req, res, filePath) {
    var reqUrl = url.parse(req.url);
    console.log('Processing PHP ' + filePath);

    var env = {};
    env.REDIRECT_STATUS = 1;
    env.SCRIPT_FILENAME = filePath;
    env.REQUEST_URI = req.url;
    env.REMOTE_ADDR = '';
    
    req.resume();
    cgi(PHP_EXECUTABLE, { env: env, stderr: process.stdout })(req, res);
}

http.createServer(requestHandler).listen(PORT);
console.log('Server running at http://127.0.0.1:' + PORT + '/');