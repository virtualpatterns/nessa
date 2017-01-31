var Page = require('webpage');

var page = Page.create();

page.onCallback = function(data) {
  console.log('page.onCallback = function(data) { ... }');
  console.log('data.message="' + data.message + '"');
};

page.onError = function(message, trace) {
  console.log('page.onError = function(message, trace) { ... }');
};

page.onLoadStarted = function() {
  console.log('page.onLoadStarted = function() { ... }');
};
page.onLoadFinished = function() {
  console.log('page.onLoadFinished = function() { ... }');
};

page.open('http://localhost:8082/www/test.html')
