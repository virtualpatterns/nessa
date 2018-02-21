import CreateTag from 'virtual-dom/h'
import Each from 'foreach'
import EscapeHtml from 'escape-html'
import Is from '@pwn/is'

const ATTRIBUTE_MAP = {
  'CLASS': 'className'
}

const Utilities = Object.create({})

Utilities.createTag = function (name, attributes, children) {
  return CreateTag(name, attributes, this.aggregateChildren(children))
}

Utilities.createElement = function (element, attributes) {

  if (Is.function(element)) {
    return element(attributes)
  } else {
    return element
  }

}

Utilities.addAttribute = function (name, value, attributes, isMapped = true, isEscaped = true) {

  name = isMapped ? this.mapAttributeName(name) : name
  value = this.renderAttributeValue(name, value, attributes[name])

  if (value) {
    attributes[name] = isEscaped ? EscapeHtml(value) : value
  }

}

Utilities.mapAttributeName = function (name) {
  return ATTRIBUTE_MAP[name.toUpperCase()] || name
}

Utilities.renderAttributeValue = function (name, value, accumulator) {

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

  return _value

}

Utilities.aggregateChildren = function (nodes) {

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

  return _nodes

}

Utilities.forEach = function (object, eachFn) {

  let context = {
    'index': 0
  }

  Each(object, (value, key, context) => {
    eachFn(value, key, context)
    context.index++
  }, context)

  return context.index

}

export default Utilities
