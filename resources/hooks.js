var FileSystem = require('fs');

var outputStream = null;

module.exports = {
  beforeStart: function(options) {

    try {

      outputStream = FileSystem.open( './process/logs/nessa.www.log', 'a', 'utf-8');
      outputStream.writeLine('- beforeStart: function(options) { ... }');

      var onCallbackFn = options.page.onCallback;

      options.page.onCallback = function(data) {

        if (data.message) {
          outputStream.writeLine(data.message);
        }

        if (onCallbackFn) {
          onCallbackFn(data);
        }

      };

      var onErrorFn = options.page.onError;

      options.page.onError = function(message, trace) {

        outputStream.writeLine(message);

        if (onErrorFn) {
          onErrorFn(message, trace);
        }

      };

    }
    catch(error) {
      console.log('An error occured in the "beforeStart" hook.');
      console.log(error.stack);
    }

  },
  afterEnd: function() {

    try {
      outputStream.writeLine('- afterEnd: function() { ... }');
      outputStream.close();
    }
    catch(error) {
      console.log('An error occured in the "afterEnd" hook.');
      console.log(error.stack);
    }

  }
};
