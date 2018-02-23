import { transform as Compile } from 'babel-core'
import EscapeJs from 'jsesc'
import { FileSystem, Log, Path } from '@virtualpatterns/mablung'
import Filters from 'pug-filters'
import { format as Format } from 'prettier'
import Identifier from 'to-js-identifier'
import Lexer from 'pug-lexer'
import Linker from 'pug-linker'
import Loader from 'pug-load'
import Parser from 'pug-parser'
import With from 'with'

import UnSupportedError from './errors/unsupported-error'

const Transform = Object.create({})

Transform.processNode = function (node, source) {
  Log.debug({ 'node.type.toUpperCase()': node.type.toUpperCase() }, 'Transform.processNode(node, source)')

  switch (node.type.toUpperCase()) {
    case 'BLOCK':
      this.processBlock(node, source)
      break
    case 'CASE':
      this.processCase(node, source)
      break
    case 'WHEN':
      this.processWhen(node, source)
      break
    case 'CODE':
      this.processCode(node, source)
      break
    case 'COMMENT':
      this.processComment(node, source)
      break
    case 'BLOCKCOMMENT':
      this.processBlockComment(node, source)
      break
    case 'CONDITIONAL':
      this.processConditional(node, source)
      break
    case 'EACH':
      this.processEach(node, source)
      break
    case 'WHILE':
      this.processWhile(node, source)
      break
    case 'NAMEDBLOCK':
      this.processNamedBlock(node, source)
      break
    case 'FILTER':
      this.processFilter(node, source)
      break
    case 'MIXIN':
      this.processMixin(node, source)
      break
    case 'MIXINBLOCK':
      this.processMixinBlock(node, source)
      break
    case 'TAG':
      this.processTag(node, source)
      break
    case 'TEXT':
      this.processText(node, source)
      break
    default:
      throw new UnSupportedError(`The node type ${node.type} is unsupported.`)
  }

}

Transform.processBlock = function (node, source) {
  Log.debug({ 'node.nodes.length': node.nodes.length }, 'Transform.processBlock(node, source)')
  node.nodes.forEach((childNode) => this.processNode(childNode, source))
}

Transform.processCase = function (node, source) {
  Log.debug({ 'node.expr': node.expr }, 'Transform.processCase(node, source)')

  source.push(`switch(${node.expr}) {`)
  node.block.nodes.forEach((whenNode) => this.processWhen(whenNode, source))
  source.push('}')

}

Transform.processWhen = function (node, source) {
  Log.debug({ 'node.expr': node.expr }, 'Transform.processWhen(node, source)')

  if (node.expr == 'default') {
    source.push(`${node.expr}:`)
    this.processBlock(node.block, source)
  } else {

    source.push(`case ${node.expr}:`)

    if (node.block) {

      if (node.block.nodes.length == 1 &&
          node.block.nodes[0].type.toUpperCase() == 'CODE' &&
          node.block.nodes[0].val == 'break') {
        // OK
      } else {
        this.processBlock(node.block, source)
      }

      source.push('break')

    }

  }

}

Transform.processCode = function (node, source) {
  Log.debug({
    'node.buffer': node.buffer,
    'node.mustEscape': node.mustEscape,
    'node.val': node.val
  }, 'Transform.processCode(node, source)')

  if (node.buffer) {
    if (node.mustEscape) {
      source.push(`_nodes = _nodes.concat(${node.val})`)
    } else {
      throw new UnSupportedError('Buffered unescaped source is unsupported.')
    }
  } else {

    source.push(`${node.val}`)

    if (node.block) {
      source.push('{')
      this.processBlock(node.block, source)
      source.push('}')
    } else {
      source.push('')
    }

  }

}

Transform.processComment = function (node, source) {
  Log.debug({ 'node.buffer': node.buffer, 'node.val': node.val }, 'Transform.processComment(node, source)')

  if (node.buffer) {
    source.push(`//${node.val}`)
  }

}

Transform.processBlockComment = function (node, source) {
  Log.debug({ 'node.buffer': node.buffer }, 'Transform.processBlockComment(node, source)')

  if (node.buffer) {
    node.block.nodes
      .filter((node) => node.type.toUpperCase() == 'TEXT')
      .map((node) => node.val)
      .filter((comment) => comment != '\n')
      .forEach((comment) => source.push(`// ${comment}`))
  }

}

Transform.processConditional = function (node, source) {
  Log.debug({ 'node.test': node.test }, 'Transform.processConditional(node, source)')

  source.push(`if ( ${node.test} ) {`)
  if (node.consequent) {
    this.processBlock(node.consequent, source)
  }
  source.push('}')

  if (node.alternate) {
    source.push('else {')
    this.processNode(node.alternate, source)
    source.push('}')
  }

}

Transform.processEach = function (node, source) {
  Log.debug({
    'node.obj': node.obj,
    'node.val': node.val,
    'node.key': node.key
  }, 'Transform.processEach(node, source)')

  source.push(`if ( _utilities.forEach(${node.obj}, function(${node.val}${node.key ? `, ${node.key}` : ''}) {`)
  if (node.block) {
    this.processBlock(node.block, source)
  }
  source.push('}) <= 0 ) {')
  if (node.alternate) {
    this.processBlock(node.alternate, source)
  }
  source.push('}')

}

Transform.processWhile = function (node, source) {
  Log.debug({ 'node.test': node.test }, 'Transform.processWhile(node, source)')

  source.push(`while ( ${node.test} ) {`)
  if (node.block) {
    this.processBlock(node.block, source)
  }
  source.push('}')

}

Transform.processNamedBlock = function (node, source) {
  Log.debug({
    'node.name': node.name,
    'node.mode': node.mode
  }, 'Transform.processNamedBlock(node, source)')
  this.processBlock(node, source)
}

Transform.processFilter = function (node, source) {
  Log.debug({ 'node.name': node.name }, 'Transform.processFilter(node, source)')

  let parentTag = node.attrs
    .filter((attribute) => attribute.name.toUpperCase() == 'PARENTTAG')
    .map((attribute) => attribute.val)[0]

  Log.debug({ 'parentTag': parentTag, 'node (before)': node })

  Filters.handleFilters(node)

  Log.debug({ 'node (after)': node })

  if (parentTag) {
    source.push(`_nodes = _nodes.concat(_utilities.createTag(${parentTag}, { 'innerHTML': '${EscapeJs(node.val)}' }, []))`)
  } else {
    this.processNode(node, source)
  }

}

Transform.processMixin = function (node, source) {
  Log.debug({ 'node.name': node.name, 'node.call': node.call }, 'Transform.processMixin(node, source)')

  if (node.call) {

    let attributesSource = []
    this.processAttributes(node, attributesSource, false)

    let blockSource = []
    this.processNodes(node, blockSource)

    source.push('_nodes = _nodes.concat(')
    source.push(`_mixin_${Identifier(node.name)}(`)
    source.push(`${attributesSource.join('\n')}, `)
    source.push(`${blockSource.join('\n')}`)
    source.push(`${node.args ? `, ${node.args}` : ''}))`)

  } else {

    source.push(`function _mixin_${Identifier(node.name)}(attributes, block${node.args ? `, ${node.args}` : ''}) {`)
    source.push('let _nodes = []')
    this.processBlock(node.block, source)
    source.push('return _nodes')
    source.push('}')

  }

}

Transform.processMixinBlock = function (node, source) {
  Log.debug('Transform.processMixinBlock(node, source)')
  source.push('_nodes = _nodes.concat(block)')
}

Transform.processTag = function (node, source) {
  Log.debug({ 'node.name': node.name, 'node.selfClosing': node.selfClosing }, 'Transform.processTag(node, source)')

  if (node.selfClosing) {
    throw new UnSupportedError('Self-closing tags are unsupported.')
  } else {

    let attributesSource = []
    this.processAttributes(node, attributesSource, true)

    let childrenSource = []
    this.processNodes(node, childrenSource)

    if (node.name[0] == node.name[0].toUpperCase()) {

      source.push('_nodes = _nodes.concat(')
      source.push('_utilities.createElement(')
      source.push(`${node.name}, `)
      source.push(`${attributesSource.join('\n')}))`)

    } else {

      source.push('_nodes = _nodes.concat(')
      source.push('_utilities.createTag(')
      source.push(`'${node.name}', `)
      source.push(`${attributesSource.join('\n')}, `)
      source.push(`${childrenSource.join('\n')}))`)

    }

  }

}

Transform.processAttributes = function (node, source, isMapped = true) {
  Log.debug(`processAttributes(node, source, ${isMapped})`)

  if (node.attrs.length > 0 ||
      node.attributeBlocks.length > 0) {

    source.push('(() => {')

    source.push('let _attributes = {}')

    node.attrs.forEach((attribute) => {
      this.processAttribute(attribute, source, isMapped)
    })

    this.processAttributeBlocks(node, source)

    source.push('return _attributes')
    source.push('})()')

  } else {
    source.push('null')
  }

}

Transform.processAttribute = function (attribute, source, isMapped = true) {
  Log.debug({ 'attribute.name': attribute.name, 'attribute.val': attribute.val }, `processAttribute(attribute, source, ${isMapped})`)
  source.push(`_utilities.addAttribute('${attribute.name}', ${attribute.val}, _attributes, ${isMapped}, ${attribute.mustEscape})`)
}

Transform.processAttributeBlocks = function (node, source) {
  Log.debug('Transform.processAttributeBlocks(node, source)')

  node.attributeBlocks.forEach((attributeBlock) => {
    this.processAttributeBlock(attributeBlock, source)
  })

}

Transform.processAttributeBlock = function (attributeBlock, source) {
  Log.debug({ 'attributeBlock.val': attributeBlock.val }, 'Transform.processAttributeBlock(attributeBlock, source)')

  source.push(`_utilities.forEach(${attributeBlock.val}, function(value, key) {`)
  source.push('_utilities.addAttribute(key, value, _attributes)')
  source.push('})')

}

Transform.processNodes = function (node, source) {
  Log.debug('Transform.processNodes(node, source)')

  if (node.block &&
      node.block.nodes.length > 0) {

    source.push('(() => {')
    source.push('let _nodes = []')
    this.processBlock(node.block, source)
    source.push('return _nodes')
    source.push('})()')

  } else {
    source.push('null')
  }

}

Transform.processText = function (node, source) {
  Log.debug({ 'EscapeJs(node.val)': EscapeJs(node.val) }, 'Transform.processText(node, source)')
  source.push(`_nodes = _nodes.concat('${EscapeJs(node.val)}')`)
}

Transform.renderContent = function (content, context) {
  Log.debug({ 'content': content, 'context': context }, 'Transform.renderContent(content, context) { ... }')

  let rootNode =
    Linker(
      Loader(
        Parser(
          Lexer(
            content,
            {
              'filename': context.path
            }),
          {
            'filename': context.path
          }),
        {
          'lex': Lexer,
          'parse': Parser
        }))

  // Log.debug({ 'rootNode': rootNode })

  let source = []

  source.push('const _utilities = Utilities')
  source.push('')
  source.push('let _nodes = []')
  this.processNode(rootNode, source)
  source.push('return _nodes[0]')

  source = source.join('\n')

  // Log.debug(`source (before with) ...\n\n${source}\n`)
  source = With('data', source)
  // Log.debug(`source (after with) ...\n\n${source}\n`)

  return source

}

Transform.renderModule = function (content, context) {
  Log.debug('Transform.renderModule(content, context) { ... }')

  let source = []

  source.push('export default function (data) {')
  source.push(this.renderContent(content, context))
  source.push('}')

  source = this.formatSource(source.join('\n'))

  // Log.debug(`source ...\n\n${source}\n`)

  return source

}

Transform.renderPath = function (path) {
  Log.debug(`Transform.renderPath('${Path.trim(path)}') { ... }`)

  let content = FileSystem.readFileSync(path, { 'encoding': 'utf-8' })
  let source = []

  source.push('function _render (data) {')
  source.push(this.renderContent(content, { 'path': path }))
  source.push('}')

  source = this.formatSource(source.join('\n'))

  // Log.debug(`source ...\n\n${source}\n`)

  return source

}

Transform.compilePath = function (path) {
  Log.debug(`Transform.compilePath('${Path.trim(path)}') { ... }`)
  return new Function('data', `return (${this.renderPath(path)})(data);`)
}

Transform.formatSource = function (source) {
  Log.debug('Transform.formatSource(source) { ... }')
  Log.debug(`(before)\n\n${source}\n`)

  source = Compile(source, { 'presets': [ ['env', {} ] ] }).code

  // Log.debug(`(after compile)\n\n${source}\n`)

  source = Format(source, {
    'bracketSpacing': true,
    'printWidth': 100,
    'singleQuote': true,
    'tabWidth': 2,
    'trailingComma': 'none'
  })

  source = source.replace('\'use strict\';\n', '')

  Log.debug(`(after)\n\n${source}\n`)

  return source

}

export default Transform
