phpnode
=======

phpnode is a really simple web server with support for PHP.

This can be handy as an easy PHP development server. In contrast to
PHP's built in web server phpnode can handle parallel requests due to
node.js asynchroneous nature.

Usage
-----
Copy phpnode.js to the document root of your web project and install the dependencies:

 npm install mime
 npm install cgi

Start the server with:

  node phpnode.js

You might want to customize the values for PORT ad PHP_EXECUTABLE in phpnode.js.