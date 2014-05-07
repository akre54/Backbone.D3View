var jsdom = require('jsdom').jsdom;
global.document = jsdom('<html><body><div id="mocha"></div><div id="testbed"></div></body></html>');
global.window = document.parentWindow;
