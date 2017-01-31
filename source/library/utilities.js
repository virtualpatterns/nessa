import Is from '@pwn/is'
import Each from 'foreach'
import Create from 'virtual-dom/h'
import Escape from 'escape-html'

import Log from './log'

const ATTRIBUTE_MAP = {
  'CLASS': 'className'
}

let Utilities = Object.create({})

Utilities.create = function (...parameters) {
  Log.debug(`- Utilities.create(...parameters) { ... }`)
  // Log.inspect('parameters', parameters)
  return Create.apply(Create, parameters)
}

Utilities.mapAttributeName = function (name) {
  // Log.debug(`> Utilities.mapAttributeName('${name}') { ... }`)
  let _name = ATTRIBUTE_MAP[name.toUpperCase()] || name
  Log.debug(`< Utilities.mapAttributeName('${name}') { ... } _name='${_name}'`)
  return _name
}

Utilities.renderAttributeValue = function (name, value, accumulator) {
  // Log.debug(`> Utilities.renderAttributeValue('${name}', value, ${accumulator ? `'${accumulator}'` : accumulator}) { ... }`)
  // Log.inspect('value', value)

  let _value = null

  if (Is.boolean(value)) {
    _value = value ? name : false
  } else if (Is.string(value)) {
    _value = accumulator ? `${accumulator} ${value}` : value
  } else if (Is.array(value)) {
    _value = accumulator ? `${accumulator} ${value.join(' ')}` : value.join(' ')
  } else if (Is.object(value)) {

    switch (name.toUpperCase()) {
      case 'CLASSNAME':
        _value = Object.keys(value)
          .filter((key) => value[key])
          .join(' ')
        break
      case 'STYLE':
        _value = Object.keys(value)
          .map((key) => `${key}:${value[key]}`)
          .join(';')
        break
      default:
        _value = value
    }

  } else {
    _value = value
  }

  Log.debug(`< Utilities.renderAttributeValue('${name}', value, ${accumulator ? `'${accumulator}'` : accumulator}) { ... }`)
  Log.inspect('_value', _value)

  return _value

}

Utilities.escape = function (...parameters) {
  // Log.debug(`> Utilities.escape(...parameters) { ... }`)
  let _value = Escape.apply(Escape, parameters)
  Log.debug(`< Utilities.escape(...parameters) { ... } _value='${_value}'`)
  return _value
}

Utilities.forEach = function (object, eachFn) {
  Log.debug(`> Utilities.forEach(object, eachFn, context) { ... }`)

  let context = {
    'index': 0
  }

  Each(object, (value, key, context) => {
    eachFn(value, key, context)
    context.index++
  }, context)

  return context.index

}

module.exports = Utilities
