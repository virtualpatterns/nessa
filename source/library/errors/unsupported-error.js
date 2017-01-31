function UnSupportedError(message, code) {

  Error.call(this)
  Error.captureStackTrace(this, UnSupportedError)

  this.message = message
  this.code = code

}

UnSupportedError.prototype = Object.create(Error.prototype)
UnSupportedError.prototype.constructor = UnSupportedError
UnSupportedError.prototype.name = UnSupportedError.name

module.exports = UnSupportedError
