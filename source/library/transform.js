import { transform as Compile } from 'babel-core'
import EscapeJs from 'jsesc'
// import { js_beautify as Format } from 'js-beautify'
import Filters from 'pug-filters'
import { format as Format } from 'prettier'
import Identifier from 'to-js-identifier'
import Is from '@pwn/is'
import Lexer from 'pug-lexer'
import Linker from 'pug-linker'
import Loader from 'pug-load'
import Parser from 'pug-parser'
import With from 'with'

import FileSystem from './file-system'
import Log from './log'
import Package from '../package.json'
import Path from './path'

import UnSupportedError from './errors/unsupported-error'

let Transform = Object.create({})

Transform.render = function (content, context, options) {
  Log.debug('- Transform.render(content, context, options) { ... }')
  Log.inspect('content', content)
  Log.inspect('context', context)
  Log.inspect('options', options)

  const processNode = (node) => {
    Log.debug('- processNode(node)')
    Log.debug(`- node.type.toUpperCase()='${node.type.toUpperCase()}'`)

    switch (node.type.toUpperCase()) {
      case 'BLOCK':
        processBlock(node)
        break
      case 'CASE':
        processCase(node)
        break
      case 'WHEN':
        processWhen(node)
        break
      case 'CODE':
        processCode(node)
        break
      case 'COMMENT':
        processComment(node)
        break
      case 'BLOCKCOMMENT':
        processBlockComment(node)
        break
      case 'CONDITIONAL':
        processConditional(node)
        break
      case 'EACH':
        processEach(node)
        break
      case 'WHILE':
        processWhile(node)
        break
      // case 'EXTENDS':
      //   processExtends(node)
      //   break
      case 'NAMEDBLOCK':
        processNamedBlock(node)
        break
      case 'FILTER':
        processFilter(node)
        break
      // case 'INCLUDE':
      //   processInclude(node)
      //   break
      // case 'RAWINCLUDE':
      //   processRawInclude(node)
      //   break
      case 'MIXIN':
        processMixin(node)
        break
      case 'MIXINBLOCK':
        processMixinBlock(node)
        break
      case 'TAG':
        processTag(node)
        break
      case 'TEXT':
        processText(node)
        break
      default:
        throw new UnSupportedError(`The node type ${node.type} is unsupported.`)
    }

  }

  const processBlock = (node) => {
    Log.debug('- processBlock(node)')
    Log.debug(`- node.nodes.length=${node.nodes.length}`)

    if (node.nodes.length > 0) {
      source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat((() => {`)
      source.push(`let ${Package.name}Nodes = [];`)
      node.nodes.forEach((childNode) => processNode(childNode))
      source.push(`return ${Package.name}Nodes;`)
      source.push('})());')
    }

  }

  const processCase = (node) => {
    Log.debug('- processCase(node)')
    Log.debug(`- node.expr='${node.expr}'`)

    source.push(`switch(${node.expr}) {`)
    node.block.nodes.forEach((whenNode) => processNode(whenNode))
    source.push('};')

  }

  const processWhen = (node) => {
    Log.debug('- processWhen(node)')
    Log.debug(`- node.expr='${node.expr}'`)

    if (node.expr == 'default') {
      source.push(`${node.expr}:`)
      processBlock(node.block)
    } else {

      source.push(`case ${node.expr}:`)

      if (node.block) {

        if (node.block.nodes.length == 1 &&
            node.block.nodes[0].type.toUpperCase() == 'CODE' &&
            node.block.nodes[0].val == 'break') {
          // Do nothing
        }
        else {
          processBlock(node.block)
        }

        source.push('break;')

      }

    }

  }

  const processCode = (node) => {
    Log.debug('- processCode(node)')
    Log.debug(`- node.buffer=${node.buffer}`)
    Log.debug(`- node.mustEscape=${node.mustEscape}`)
    Log.inspect('node.val', node.val)

    if (node.buffer) {
      if (node.mustEscape) {
        source.push(`${Package.name}Nodes.push(${node.val});`)
      } else {
        throw new UnSupportedError('Buffered unescaped source is unsupported.')
      }
    } else {

      source.push(`${node.val}`)

      if (node.block) {
        source.push('{')
        processBlock(node.block)
        source.push('}')
      } else {
        source.push(';')
      }

    }

  }

  const processComment = (node) => {
    Log.debug('- processComment(node)')
    Log.debug(`- node.buffer=${node.buffer}`)
    Log.debug(`- node.val='${node.val}'`)

    if (node.buffer) {
      source.push(`//${node.val}`)
    }

  }

  const processBlockComment = (node) => {
    Log.debug('- processBlockComment(node)')
    Log.debug(`- node.buffer=${node.buffer}`)

    if (node.buffer) {
      node.block.nodes
        .filter((node) => node.type.toUpperCase() == 'TEXT')
        .map((node) => node.val)
        .filter((comment) => comment != '\n')
        .forEach((comment) => source.push(`// ${comment}`))
    }

  }

  const processConditional = (node) => {
    Log.debug('- processConditional(node)')
    Log.debug(`- node.test=${node.test}`)

    source.push(`if ( ${node.test} ) {`)
    if (node.consequent) {
      processBlock(node.consequent, source)
    }
    source.push(`}`)

    if (node.alternate) {
      source.push('else {')
      processNode(node.alternate, source)
      source.push('}')
    }

  }

  const processEach = (node) => {
    Log.debug('- processEach(node)')
    Log.debug(`- node.obj=${node.obj}`)
    Log.debug(`- node.val=${node.val}`)
    Log.debug(`- node.key=${node.key}`)

    source.push(`if ( ${Package.name}Utilities.forEach(${node.obj}, function(${node.val}${node.key ? `, ${node.key}` : ''}) {`)
      if (node.block) {
        processBlock(node.block)
      }
    source.push('}) <= 0 ) {')
      if (node.alternate) {
        processBlock(node.alternate, source)
      }
    source.push('}')

  }

  const processWhile = (node) => {
    Log.debug('- processWhile(node)')
    Log.debug(`- node.test=${node.test}`)

    source.push(`while ( ${node.test} ) {`)
      if (node.block) {
        processBlock(node.block)
      }
    source.push(`}`)

  }

  // const processExtends = (node) => {
  //   Log.debug('- processExtends(node)')
  // }

  const processNamedBlock = (node) => {
    Log.debug('- processNamedBlock(node)')
    Log.debug(`- node.name='${node.name}'`)
    Log.debug(`- node.mode='${node.mode}'`)

    processBlock(node)

  }

  const processFilter = (node) => {
    Log.debug('- processFilter(node)')
    Log.debug(`- node.name='${node.name}'`)

    let parentTag = node.attrs
      .filter((attribute) => attribute.name.toUpperCase() == 'PARENTTAG')
      .map((attribute) => attribute.val)[0]

    Log.debug(`- parentTag=${parentTag}`)

    Log.inspect('node (before)', node)
    Filters.handleFilters(node)
    Log.inspect('node (after)', node)

    if (parentTag) {
      source.push(`${Package.name}Nodes.push(${Package.name}Utilities.create(${parentTag}, { 'innerHTML': '${EscapeJs(node.val)}' }, []));`)
    } else {
      processNode(node)
    }

  }

  // const processInclude = (node) => {
  //   Log.debug('- processInclude(node)')
  //   Log.debug(`- node.file.path='${node.file.path}'`)
  //   Log.debug(`- context.path='${context.path}'`)
  //
  //   // let path = Path.join(Path.dirname(context.path), node.file.path)
  //   // let content = FileSystem.readFileSync(path, {
  //   //   'encoding': 'utf-8'
  //   // })
  //   //
  //   // // source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat((function(data) {`)
  //   // source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(`)
  //   // // source.push('')
  //   // source.push(this.render(content, {
  //   //   'path': path
  //   // }, options))
  //   // // source.push('')
  //   // // source.push('})(data));')
  //   // source.push(');')
  //
  // }

  // const processRawInclude = (node) => {
  //   Log.debug('- processRawInclude(node)')
  //   Log.debug(`- node.file.path='${node.file.path}'`)
  //   Log.debug(`- context.path='${context.path}'`)
  //
  //   // let path = Path.join(Path.dirname(context.path), node.file.path)
  //   // let content = FileSystem.readFileSync(path, {
  //   //   'encoding': 'utf-8'
  //   // })
  //   //
  //   // source.push(`${Package.name}Nodes.push('${EscapeJs(content)}');`)
  //
  // }

  const processMixin = (node) => {
    Log.debug('- processMixin(node)')
    Log.debug(`- node.name='${node.name}'`)
    Log.debug(`- node.call=${node.call}`)

    if (node.call) {

      source.push(`(() => {`)

      if (node.attrs.length > 0) {
        source.push(`let ${Package.name}Attributes = {};`)
        source.push(`let ${Package.name}AttributeName;`)
        source.push(`let ${Package.name}AttributeValue;`)
      }

      node.attrs.forEach((attribute) => processAttribute(attribute, false))

      if (node.block &&
          node.block.nodes.length > 0) {
        source.push(`let ${Package.name}Block = [];`)
        source.push(`${Package.name}Block = ${Package.name}Block.concat((() => {`)
        source.push(`let ${Package.name}Nodes = [];`)
        node.block.nodes.forEach((blockNodes) => processNode(blockNodes, source))
        source.push(`return ${Package.name}Nodes;`)
        source.push('})());')
      }

      source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(`)
        source.push(`${Package.name}Mixin_${Identifier(node.name)}(`)
          source.push(`${node.attrs.length ? `${Package.name}Attributes` : '{}'}, `)
          source.push(`${node.block && node.block.nodes.length ? `${Package.name}Block` : 'null'}`)
          source.push(`${node.args ? `, ${node.args}` : ''}));`)

      source.push('})();')

    } else {
      source.push(`function ${Package.name}Mixin_${Identifier(node.name)}(attributes, block${node.args ? `, ${node.args}` : ''}) {`)
      source.push(`let ${Package.name}Nodes = [];`)
      node.block.nodes.forEach((childNode) => processNode(childNode))
      source.push(`return ${Package.name}Nodes;`)
      source.push('};')
    }

  }

  const processMixinBlock = (node) => {
    Log.debug('- processMixinBlock(node)')
    source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(block);`)
  }

  const processTag = (node) => {
    Log.debug('- processTag(node)')
    Log.debug(`- node.selfClosing=${node.selfClosing}`)
    Log.debug(`- node.name='${node.name}'`)

    if (node.selfClosing) {
      throw new UnSupportedError('Self-closing tags are unsupported.')
    } else {

      source.push('(() => {')

      if (node.attrs.length > 0 ||
          node.attributeBlocks.length > 0) {
        source.push(`let ${Package.name}Attributes = {};`)
        source.push(`let ${Package.name}AttributeName;`)
        source.push(`let ${Package.name}AttributeValue;`)
      }

      if (node.attributeBlocks.length > 0) {
        source.push(`let ${Package.name}AttributeBlock;`)
      }

      node.attrs.forEach((attribute) => processAttribute(attribute))
      node.attributeBlocks.forEach((attributeBlock) => processAttributeBlock(attributeBlock))

      if (node.block.nodes.length > 0) {
        source.push(`let ${Package.name}Children = [];`)
        source.push(`${Package.name}Children = ${Package.name}Children.concat((() => {`)
        source.push(`let ${Package.name}Nodes = [];`)
        node.block.nodes.forEach((childNode) => processNode(childNode))
        source.push(`return ${Package.name}Nodes;`)
        source.push('})());')
      }

      source.push(`${Package.name}Nodes.push(`)
        source.push(`${Package.name}Utilities.create(`)
          source.push(`'${node.name}', `)
          source.push(`${node.attrs.length > 0 || node.attributeBlocks.length > 0 ? `${Package.name}Attributes` : '{}'}, `)
          source.push(`${node.block.nodes.length > 0 ? `${Package.name}Children` : '[]'}));`)

      source.push('})();')

    }

  }

  const processAttribute = (attribute, isMapped = true) => {
    Log.debug('- processAttribute(attribute)')
    Log.debug(`- attribute.name='${attribute.name}'`)
    Log.debug(`- attribute.val=${attribute.val}`)
    Log.debug(`- isMapped=${isMapped}`)

    if (isMapped) {
      source.push(`${Package.name}AttributeName = ${Package.name}Utilities.mapAttributeName('${attribute.name}');`)
    } else {
      source.push(`${Package.name}AttributeName = '${attribute.name}';`)
    }

    source.push(`${Package.name}AttributeValue = ${Package.name}Utilities.renderAttributeValue(${Package.name}AttributeName, ${attribute.val}, ${Package.name}Attributes[${Package.name}AttributeName]);`)

    source.push(`if (${Package.name}AttributeValue) {`)
      if (attribute.mustEscape) {
        source.push(`${Package.name}Attributes[${Package.name}AttributeName] = ${Package.name}Utilities.escape(${Package.name}AttributeValue);`)
      } else {
        source.push(`${Package.name}Attributes[${Package.name}AttributeName] = ${Package.name}AttributeValue;`)
      }
    source.push('}')

  }

  const processAttributeBlock = (attributeBlock) => {
    Log.debug('- processAttributeBlock(attributeBlock)')
    Log.inspect('attributeBlock', attributeBlock)

    source.push(`${Package.name}AttributeBlock = ${attributeBlock};`)

    // source.push(`Object.keys(${Package.name}AttributeBlock).forEach(function(key) {`)
    // source.push(`${Package.name}AttributeName = ${Package.name}Utilities.mapAttributeName(key);`)
    // source.push(`${Package.name}AttributeValue = ${Package.name}Utilities.renderAttributeValue(${Package.name}AttributeName, ${Package.name}AttributeBlock[key], ${Package.name}Attributes[${Package.name}AttributeName]);`)

    source.push(`${Package.name}Utilities.forEach(${Package.name}AttributeBlock, function(value, key) {`)
    source.push(`${Package.name}AttributeName = ${Package.name}Utilities.mapAttributeName(key);`)
    source.push(`${Package.name}AttributeValue = ${Package.name}Utilities.renderAttributeValue(${Package.name}AttributeName, value, ${Package.name}Attributes[${Package.name}AttributeName]);`)

    source.push(`if (${Package.name}AttributeValue) {`)
    source.push(`${Package.name}Attributes[${Package.name}AttributeName] = ${Package.name}AttributeValue;`)
    source.push('}')

    source.push('})')

  }

  const processText = (node) => {
    Log.debug('- processText(node)')
    Log.debug(`- node.val='${EscapeJs(node.val)}'`)
    source.push(`${Package.name}Nodes.push('${EscapeJs(node.val)}');`)
  }

  // let nodes =
  //   Parser(
  //     Lexer(
  //       content,
  //       {
  //         'filename': context.path
  //       }),
  //     {
  //         'filename': context.path
  //     }
  //   )

  let nodes =
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

  Log.inspect('nodes', nodes)

  let source = []

  source.push('(() => {')
  source.push(`let ${Package.name}Nodes = [];`)
  processNode(nodes, source)
  source.push(`return ${Package.name}Nodes[0];`)
  source.push('})()')

  return source.join('\n')

}

Transform._render = function (content, context, options) {
  Log.debug('- Transform._render(content, context, options) { ... }')

  let source = []

  source.push('')
  // source.push(`let ${Package.name}Utilities = require('${options.require && options.require.utilities ? options.require.utilities : `${Package.name}/library/utilities`}');`)
  source.push(`const ${Package.name}Utilities = require('${options.require && options.require.utilities ? options.require.utilities : `${Package.name}/library/utilities`}');`)
  source.push('')
  source.push(`return ${this.render(content, context, options)};`)
  source.push('')

  source = source.join('\n')

  Log.debug('> With(\'data\', source, ...)')
  // Log.inspect('source', source)

  return With('data', source, [
    'Object',
    'require'
  ])

}

Transform.renderModule = function (content, context, options) {
  Log.debug('- Transform.renderModule(content, context, options) { ... }')

  let source = []

  source.push('module.exports = function (data) {')
  source.push(this._render(content, context, options))
  source.push('};')

  return this.format(source)

}

Transform.compilePath = function (path, options) {
  Log.debug('- Transform.compilePath(path, options) { ... }')

  let content = FileSystem.readFileSync(path, {
    'encoding': 'utf-8'
  })

  let source = []

  source.push('(() => {')
  source.push(this._render(content, {
    'path': path
  }, options))
  source.push('})();')

  return (new Function('require', 'data', `'use strict'; return ${this.format(source)};`)).bind({}, require)

}

Transform.format = function (source) {
  Log.debug('> Transform.format(source) { ... }')

  source = Is.array(source) ? source.join('\n') : source

  source = Compile(source, {
    'presets': [
      'es2015-nostrict'
    ]
  }).code

  // Log.inspect('source', source)

  source = Format(source, {
    'printWidth': 160,
    'tabWidth': 2,
    'singleQuote': true,
    'trailingComma': false,
    'bracketSpacing': true
  })

  Log.debug('< Transform.format(source) { ... }')
  Log.inspect('source', source)

  return source

}

module.exports = Transform
