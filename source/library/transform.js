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

Transform.renderContent = function (content, context) {
  Log.debug({ 'content': content, 'context': context }, 'Transform.renderContent(content, context) { ... }')

  const processNode = (node, source) => {
    Log.debug({ 'node.type.toUpperCase()': node.type.toUpperCase() }, 'processNode(node, source)')

    switch (node.type.toUpperCase()) {
      case 'BLOCK':
        processBlock(node, source)
        break
      case 'CASE':
        processCase(node, source)
        break
      case 'WHEN':
        processWhen(node, source)
        break
      case 'CODE':
        processCode(node, source)
        break
      case 'COMMENT':
        processComment(node, source)
        break
      case 'BLOCKCOMMENT':
        processBlockComment(node, source)
        break
      case 'CONDITIONAL':
        processConditional(node, source)
        break
      case 'EACH':
        processEach(node, source)
        break
      case 'WHILE':
        processWhile(node, source)
        break
      case 'NAMEDBLOCK':
        processNamedBlock(node, source)
        break
      case 'FILTER':
        processFilter(node, source)
        break
      case 'MIXIN':
        processMixin(node, source)
        break
      case 'MIXINBLOCK':
        processMixinBlock(node, source)
        break
      case 'TAG':
        processTag(node, source)
        break
      case 'TEXT':
        processText(node, source)
        break
      default:
        throw new UnSupportedError(`The node type ${node.type} is unsupported.`)
    }

  }

  const processBlock = (node, source) => {
    Log.debug({ 'node.nodes.length': node.nodes.length }, 'processBlock(node, source)')
    node.nodes.forEach((childNode) => processNode(childNode, source))
  }

  const processCase = (node, source) => {
    Log.debug({ 'node.expr': node.expr }, 'processCase(node, source)')

    source.push(`switch(${node.expr}) {`)
    node.block.nodes.forEach((whenNode) => processWhen(whenNode, source))
    source.push('}')

  }

  const processWhen = (node, source) => {
    Log.debug({ 'node.expr': node.expr }, 'processWhen(node, source)')

    if (node.expr == 'default') {
      source.push(`${node.expr}:`)
      processBlock(node.block, source)
    } else {

      source.push(`case ${node.expr}:`)

      if (node.block) {

        if (node.block.nodes.length == 1 &&
            node.block.nodes[0].type.toUpperCase() == 'CODE' &&
            node.block.nodes[0].val == 'break') {
          // OK
        } else {
          processBlock(node.block, source)
        }

        source.push('break')

      }

    }

  }

  const processCode = (node, source) => {
    Log.debug({
      'node.buffer': node.buffer,
      'node.mustEscape': node.mustEscape,
      'node.val': node.val
    }, 'processCode(node, source)')

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
        processBlock(node.block, source)
        source.push('}')
      } else {
        source.push('')
      }

    }

  }

  const processComment = (node, source) => {
    Log.debug({ 'node.buffer': node.buffer, 'node.val': node.val }, 'processComment(node, source)')

    if (node.buffer) {
      source.push(`//${node.val}`)
    }

  }

  const processBlockComment = (node, source) => {
    Log.debug({ 'node.buffer': node.buffer }, 'processBlockComment(node, source)')

    if (node.buffer) {
      node.block.nodes
        .filter((node) => node.type.toUpperCase() == 'TEXT')
        .map((node) => node.val)
        .filter((comment) => comment != '\n')
        .forEach((comment) => source.push(`// ${comment}`))
    }

  }

  const processConditional = (node, source) => {
    Log.debug({ 'node.test': node.test }, 'processConditional(node, source)')

    source.push(`if ( ${node.test} ) {`)
    if (node.consequent) {
      processBlock(node.consequent, source)
    }
    source.push('}')

    if (node.alternate) {
      source.push('else {')
      processNode(node.alternate, source)
      source.push('}')
    }

  }

  const processEach = (node, source) => {
    Log.debug({
      'node.obj': node.obj,
      'node.val': node.val,
      'node.key': node.key
    }, 'processEach(node, source)')

    source.push(`if ( _utilities.forEach(${node.obj}, function(${node.val}${node.key ? `, ${node.key}` : ''}) {`)
    if (node.block) {
      processBlock(node.block, source)
    }
    source.push('}) <= 0 ) {')
    if (node.alternate) {
      processBlock(node.alternate, source)
    }
    source.push('}')

  }

  const processWhile = (node, source) => {
    Log.debug({ 'node.test': node.test }, 'processWhile(node, source)')

    source.push(`while ( ${node.test} ) {`)
    if (node.block) {
      processBlock(node.block, source)
    }
    source.push('}')

  }

  const processNamedBlock = (node, source) => {
    Log.debug({
      'node.name': node.name,
      'node.mode': node.mode
    }, 'processNamedBlock(node, source)')
    processBlock(node, source)
  }

  const processFilter = (node, source) => {
    Log.debug({ 'node.name': node.name }, 'processFilter(node, source)')

    let parentTag = node.attrs
      .filter((attribute) => attribute.name.toUpperCase() == 'PARENTTAG')
      .map((attribute) => attribute.val)[0]

    Log.debug({ 'parentTag': parentTag, 'node (before)': node })

    Filters.handleFilters(node)

    Log.debug({ 'node (after)': node })

    if (parentTag) {
      source.push(`_nodes = _nodes.concat(_utilities.createTag(${parentTag}, { 'innerHTML': '${EscapeJs(node.val)}' }, []))`)
    } else {
      processNode(node, source)
    }

  }

  const processMixin = (node, source) => {
    Log.debug({ 'node.name': node.name, 'node.call': node.call }, 'processMixin(node, source)')

    if (node.call) {

      let attributesSource = []
      processAttributes(node, attributesSource, false)

      let blockSource = []
      processNodes(node, blockSource)

      source.push('_nodes = _nodes.concat(')
      source.push(`_mixin_${Identifier(node.name)}(`)
      source.push(`${attributesSource.join('\n')}, `)
      source.push(`${blockSource.join('\n')}`)
      source.push(`${node.args ? `, ${node.args}` : ''}))`)

    } else {

      source.push(`function _mixin_${Identifier(node.name)}(attributes, block${node.args ? `, ${node.args}` : ''}) {`)
      source.push('let _nodes = []')
      processBlock(node.block, source)
      source.push('return _nodes')
      source.push('}')

    }

  }

  const processMixinBlock = (node, source) => {
    Log.debug('processMixinBlock(node, source)')
    source.push('_nodes = _nodes.concat(block)')
  }

  const processTag = (node, source) => {
    Log.debug({ 'node.name': node.name, 'node.selfClosing': node.selfClosing }, 'processTag(node, source)')

    if (node.selfClosing) {
      throw new UnSupportedError('Self-closing tags are unsupported.')
    } else {

      let attributesSource = []
      processAttributes(node, attributesSource, true)

      let childrenSource = []
      processNodes(node, childrenSource)

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

  const processAttributes = (node, source, isMapped = true) => {
    Log.debug(`processAttributes(node, source, ${isMapped})`)

    if (node.attrs.length > 0 ||
        node.attributeBlocks.length > 0) {

      source.push('(() => {')

      source.push('let _attributes = {}')

      node.attrs.forEach((attribute) => {
        processAttribute(attribute, source, isMapped)
      })

      processAttributeBlocks(node, source)

      source.push('return _attributes')
      source.push('})()')

    } else {
      // source.push('{}')
      source.push('null')
    }

  }

  const processAttribute = (attribute, source, isMapped = true) => {
    Log.debug({ 'attribute.name': attribute.name, 'attribute.val': attribute.val }, `processAttribute(attribute, source, ${isMapped})`)
    source.push(`_utilities.addAttribute('${attribute.name}', ${attribute.val}, _attributes, ${isMapped}, ${attribute.mustEscape})`)
  }

  const processAttributeBlocks = (node, source) => {
    Log.debug('processAttributeBlocks(node, source)')

    node.attributeBlocks.forEach((attributeBlock) => {
      processAttributeBlock(attributeBlock, source)
    })

  }

  const processAttributeBlock = (attributeBlock, source) => {
    Log.debug({ 'attributeBlock.val': attributeBlock.val }, 'processAttributeBlock(attributeBlock, source)')
    // Log.debug({ 'attributeBlock': attributeBlock }, 'processAttributeBlock(attributeBlock, source)')

    source.push(`_utilities.forEach(${attributeBlock.val}, function(value, key) {`)
    // source.push(`_utilities.forEach(${attributeBlock}, function(value, key) {`)
    source.push('_utilities.addAttribute(key, value, _attributes)')
    source.push('})')

  }

  const processNodes = (node, source) => {
    Log.debug('processNodes(node, source)')

    if (node.block &&
        node.block.nodes.length > 0) {

      source.push('(() => {')
      source.push('let _nodes = []')
      processBlock(node.block, source)
      source.push('return _nodes')
      source.push('})()')

    } else {
      source.push('null')
    }

  }

  const processText = (node, source) => {
    Log.debug({ 'EscapeJs(node.val)': EscapeJs(node.val) }, 'processText(node, source)')
    source.push(`_nodes = _nodes.concat('${EscapeJs(node.val)}')`)
  }

  const withData = (source) => {
    Log.debug({ 'context': context }, 'withData(source) { ... }')
    Log.debug(`(before)\n\n${source}\n`)

    let _source = With('data', source)

    Log.debug(`(after)\n\n${_source}\n`)

    return _source

  }

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

  Log.debug({ 'rootNode': rootNode })

  let source = []

  source.push('const _utilities = Utilities')
  source.push('')
  source.push('let _nodes = []')
  processNode(rootNode, source)
  source.push('return _nodes[0]')

  source = withData(source.join('\n'))

  // Log.debug(`source ...\n\n${source}\n`)

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

  Log.debug(`(after compile)\n\n${source}\n`)

  source = Format(source, {
    'bracketSpacing': true,
    'printWidth': 100,
    'singleQuote': true,
    'tabWidth': 2,
    'trailingComma': 'none'
  })

  source = source.replace('\'use strict\';\n', '')

  Log.debug(`(after format and replace)\n\n${source}\n`)

  return source

}

export default Transform
