var FileSystem = require('fs');

var outputStream = null;

module.exports = {
  beforeStart: function(options) {
    // console.log('beforeStart: function(options) { ... }');

    try {

      outputStream = FileSystem.open( './process/logs/nessa.www.log', 'a', 'utf-8');
      outputStream.writeLine('- beforeStart: function(options) { ... }');

      var onCallbackFn = options.page.onCallback;

      options.page.onCallback = function(data) {
        // console.log('options.page.onCallback = function(data) { ... }');
        // console.log(data.message || '(no message)');
        if (data.message) {
          outputStream.writeLine(data.message);
        }
        if (onCallbackFn) {
          onCallbackFn(data);
        }
      };

      var onErrorFn = options.page.onError;

      options.page.onError = function(message, trace) {
        // console.log('options.page.onError = function(message, trace) { ... }');
        // console.log(message);
        outputStream.writeLine(message);

        // if (trace && trace.length) {
        //   trace.forEach(function(message) {
        //     // console.log(message.file + ': ' + message.line + (message.function ? ' (in function "' + message.function +'")' : ''));
        //     outputStream.writeLine(message.file + ': ' + message.line + (message.function ? ' (in function "' + message.function + '")' : ''))
        //   });
        // }

        if (onCallbackFn) {
          onCallbackFn(data);
        }

      };

    }
    catch(error) {
      console.log('An error occured in the "beforeStart" hook.');
      console.log(error.stack);
    }

  },
  afterEnd: function(options) {
    // console.log('afterEnd: function(options) { ... }');

    try {
      outputStream.writeLine('- afterEnd: function(options) { ... }');
      outputStream.close();
    }
    catch(error) {
      console.log('An error occured in the "afterEnd" hook.');
      console.log(error.stack);
    }

  }
};
