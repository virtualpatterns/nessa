import Is from '@pwn/is'
import Each from 'foreach'
import Create from 'virtual-dom/h'
import Escape from 'escape-html'

import Log from './log'

const ATTRIBUTE_MAP = {
  'CLASS': 'className'
}

const Utilities = Object.create({})

Utilities.createTag = function (name, attributes, children) {
  // Log.debug(`- Utilities.createTag('${name}', attributes, children) { ... }`)
  // Log.inspect('attributes', attributes)
  return Create(name, attributes, this.aggregateChildren(children))
}

Utilities.createElement = function (element, attributes, children) {
  // Log.debug('- Utilities.createElement(element, attributes, children) { ... }')
  // Log.inspect('attributes', attributes)

  if (Is.function(element)) {
    return element(attributes)
  } else if (Is.function(element.render)) {
    return element.render(attributes)
  } else {
    return element
  }

}

Utilities.addAttribute = function (name, value, attributes, isMapped = true, isEscaped = true) {
  // Log.debug(`> Utilities.addAttribute('${name}', value, attributes, ${isMapped}) { ... }`)

  name = isMapped ? this.mapAttributeName(name) : name
  value = this.renderAttributeValue(name, value, attributes[name])

  if (value) {
    attributes[name] = isEscaped ? this.escape(value) : value
  }

}

Utilities.mapAttributeName = function (name) {
  // Log.debug(`> Utilities.mapAttributeName('${name}') { ... }`)
  let _name = ATTRIBUTE_MAP[name.toUpperCase()] || name
  // Log.debug(`< Utilities.mapAttributeName('${name}') { ... } _name='${_name}'`)
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

  // Log.debug(`< Utilities.renderAttributeValue('${name}', value, ${accumulator ? `'${accumulator}'` : accumulator}) { ... }`)
  // Log.inspect('_value', _value)

  return _value

}

Utilities.aggregateChildren = function (nodes) {
  // Log.debug(`> Utilities.aggregateChildren(nodes) { ... }`)
  // Log.inspect('nodes', nodes)

  let _nodes = !nodes ? nodes : nodes
    .reduce((_nodes, currentNode) => {
      let lastIndex = _nodes.length - 1
      let lastNode = _nodes[lastIndex]
      if (Is.string(lastNode) &&
          Is.string(currentNode)) {
        _nodes[lastIndex] += currentNode
      } else {
        _nodes.push(currentNode)
      }
      return _nodes
    }, [])

  // Log.debug('< Utilities.aggregateChildren(nodes) { ... }')
  // Log.inspect('_nodes', _nodes)

  return _nodes

}

Utilities.escape = function (...parameters) {
  // Log.debug(`> Utilities.escape(...parameters) { ... }`)
  let _value = Escape.apply(Escape, parameters)
  // Log.debug(`< Utilities.escape(...parameters) { ... } _value='${_value}'`)
  return _value
}

Utilities.forEach = function (object, eachFn) {
  // Log.debug(`> Utilities.forEach(object, eachFn, context) { ... }`)

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
