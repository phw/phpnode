phpnode
=======

phpnode is a really simple web server based on node.js with support for PHP.

This can be handy as an easy PHP development server. In contrast to
PHP's built in web server phpnode can handle parallel requests due to
node.js' asynchroneous nature.

**NOTE:** This was only a proof of concept quickly assembled for a developer meeting.
It is archived now here for future reference.

Usage
-----
Copy phpnode.js to the document root of your web project and install the dependencies:

    npm install cgi mime

Start the server with:

    node phpnode.js

By default the server is running on port 8000. You might want to customize the values
for `PORT` and `PHP_EXECUTABLE` in phpnode.js.

License
-------

Copyright (c) 2012 Philipp Wolfer <ph.wolfer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
