import { transform as Compile } from 'babel-core'
import EscapeJs from 'jsesc'
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
  Log.debug('> Transform.render(content, context, options) { ... }')
  Log.inspect('content', content)
  Log.inspect('context', context)
  Log.inspect('options', options)

  const processNode = (node, source) => {
    Log.debug('- processNode(node, source)')
    Log.debug(`- node.type.toUpperCase()='${node.type.toUpperCase()}'`)

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
    Log.debug('- processBlock(node, source)')
    Log.debug(`- node.nodes.length=${node.nodes.length}`)
    node.nodes.forEach((childNode) => processNode(childNode, source))
  }

  const processCase = (node, source) => {
    Log.debug('- processCase(node, source)')
    Log.debug(`- node.expr='${node.expr}'`)

    source.push(`switch(${node.expr}) {`)
    node.block.nodes.forEach((whenNode) => processWhen(whenNode, source))
    source.push('}')

  }

  const processWhen = (node, source) => {
    Log.debug('- processWhen(node, source)')
    Log.debug(`- node.expr='${node.expr}'`)

    if (node.expr == 'default') {
      source.push(`${node.expr}:`)
      processBlock(node.block, source)
    } else {

      source.push(`case ${node.expr}:`)

      if (node.block) {

        if (node.block.nodes.length == 1 &&
            node.block.nodes[0].type.toUpperCase() == 'CODE' &&
            node.block.nodes[0].val == 'break') {
          // Do nothing
        }
        else {
          processBlock(node.block, source)
        }

        source.push('break')

      }

    }

  }

  const processCode = (node, source) => {
    Log.debug('- processCode(node, source)')
    Log.debug(`- node.buffer=${node.buffer}`)
    Log.debug(`- node.mustEscape=${node.mustEscape}`)
    Log.inspect('node.val', node.val)

    if (node.buffer) {
      if (node.mustEscape) {
        source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(${node.val})`)
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
    Log.debug('- processComment(node, source)')
    Log.debug(`- node.buffer=${node.buffer}`)
    Log.debug(`- node.val='${node.val}'`)

    if (node.buffer) {
      source.push(`//${node.val}`)
    }

  }

  const processBlockComment = (node, source) => {
    Log.debug('- processBlockComment(node, source)')
    Log.debug(`- node.buffer=${node.buffer}`)

    if (node.buffer) {
      node.block.nodes
        .filter((node) => node.type.toUpperCase() == 'TEXT')
        .map((node) => node.val)
        .filter((comment) => comment != '\n')
        .forEach((comment) => source.push(`// ${comment}`))
    }

  }

  const processConditional = (node, source) => {
    Log.debug('- processConditional(node, source)')
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

  const processEach = (node, source) => {
    Log.debug('- processEach(node, source)')
    Log.debug(`- node.obj=${node.obj}`)
    Log.debug(`- node.val=${node.val}`)
    Log.debug(`- node.key=${node.key}`)

    source.push(`if ( ${Package.name}Utilities.forEach(${node.obj}, function(${node.val}${node.key ? `, ${node.key}` : ''}) {`)
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
    Log.debug('- processWhile(node, source)')
    Log.debug(`- node.test=${node.test}`)

    source.push(`while ( ${node.test} ) {`)
    if (node.block) {
      processBlock(node.block, source)
    }
    source.push(`}`)

  }

  const processNamedBlock = (node, source) => {
    Log.debug('- processNamedBlock(node, source)')
    Log.debug(`- node.name='${node.name}'`)
    Log.debug(`- node.mode='${node.mode}'`)
    processBlock(node, source)
  }

  const processFilter = (node, source) => {
    Log.debug('- processFilter(node, source)')
    Log.debug(`- node.name='${node.name}'`)

    let parentTag = node.attrs
      .filter((attribute) => attribute.name.toUpperCase() == 'PARENTTAG')
      .map((attribute) => attribute.val)[0]

    Log.debug(`- parentTag=${parentTag}`)

    Log.inspect('node (before)', node)
    Filters.handleFilters(node)
    Log.inspect('node (after)', node)

    if (parentTag) {
      source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(${Package.name}Utilities.createTag(${parentTag}, { 'innerHTML': '${EscapeJs(node.val)}' }, []))`)
    } else {
      processNode(node, source)
    }

  }

  const processMixin = (node, source) => {
    Log.debug('- processMixin(node, source)')
    Log.debug(`- node.name='${node.name}'`)
    Log.debug(`- node.call=${node.call}`)

    if (node.call) {

      // source.push(`;(() => {`)
      //
      // if (node.attrs.length > 0) {
      //   source.push(`let ${Package.name}Attributes = {}`)
      //   source.push(`let ${Package.name}AttributeName`)
      //   source.push(`let ${Package.name}AttributeValue`)
      // }
      //
      // node.attrs.forEach((attribute) => processAttribute(attribute, source, false))
      //
      // if (node.block &&
      //     node.block.nodes.length > 0) {
      //   source.push(`let ${Package.name}Block = []`)
      //   source.push(`${Package.name}Block = ${Package.name}Block.concat((() => {`)
      //   source.push(`let ${Package.name}Nodes = []`)
      //   node.block.nodes.forEach((blockNodes) => processNode(blockNodes, source))
      //   source.push(`return ${Package.name}Nodes`)
      //   source.push('})())')
      // }
      //
      // source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(`)
      //   source.push(`${Package.name}Mixin_${Identifier(node.name)}(`)
      //     source.push(`${node.attrs.length ? `${Package.name}Attributes` : '{}'}, `)
      //     source.push(`${node.block && node.block.nodes.length ? `${Package.name}Block` : 'null'}`)
      //     source.push(`${node.args ? `, ${node.args}` : ''}))`)
      //
      // source.push('})()')

      let attributesSource = []
      processAttributes(node, attributesSource, false)

      let blockSource = []
      processNodes(node, blockSource)

      source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(`)
      source.push(`${Package.name}Mixin_${Identifier(node.name)}(`)
      source.push(`${attributesSource.join('\n')}, `)
      source.push(`${blockSource.join('\n')}`)
      source.push(`${node.args ? `, ${node.args}` : ''}))`)

    } else {
      source.push(`function ${Package.name}Mixin_${Identifier(node.name)}(attributes, block${node.args ? `, ${node.args}` : ''}) {`)
      source.push(`let ${Package.name}Nodes = []`)
      processBlock(node.block, source)
      source.push(`return ${Package.name}Nodes`)
      source.push('}')
    }

  }

  const processMixinBlock = (node, source) => {
    Log.debug('- processMixinBlock(node, source)')
    source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(block)`)
  }

  const processTag = (node, source) => {
    Log.debug('- processTag(node, source)')
    Log.debug(`- node.selfClosing=${node.selfClosing}`)
    Log.debug(`- node.name='${node.name}'`)

    if (node.selfClosing) {
      throw new UnSupportedError('Self-closing tags are unsupported.')
    } else {

      // source.push(';(() => {')
      //
      // if (node.attrs.length > 0 ||
      //     node.attributeBlocks.length > 0) {
      //   source.push(`let ${Package.name}Attributes = {}`)
      //   source.push(`let ${Package.name}AttributeName`)
      //   source.push(`let ${Package.name}AttributeValue`)
      // }
      //
      // if (node.attributeBlocks.length > 0) {
      //   source.push(`let ${Package.name}AttributeBlock`)
      // }
      //
      // node.attrs.forEach((attribute) => processAttribute(attribute))
      // node.attributeBlocks.forEach((attributeBlock) => processAttributeBlock(attributeBlock))
      //
      // if (node.block.nodes.length > 0) {
      //   source.push(`let ${Package.name}Children = []`)
      //   source.push(`${Package.name}Children = ${Package.name}Children.concat((() => {`)
      //   source.push(`let ${Package.name}Nodes = []`)
      //   node.block.nodes.forEach((childNode) => processNode(childNode))
      //   source.push(`return ${Package.name}Nodes`)
      //   source.push('})())')
      // }
      //
      // source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(`)
      //   source.push(`${Package.name}Utilities.createTag(`)
      //     source.push(`'${node.name}', `)
      //     source.push(`${node.attrs.length > 0 || node.attributeBlocks.length > 0 ? `${Package.name}Attributes` : '{}'}, `)
      //     source.push(`${node.block.nodes.length > 0 ? `${Package.name}Children` : '[]'}))`)
      //
      // source.push('})()')

      let attributesSource = []
      processAttributes(node, attributesSource, true)

      let childrenSource = []
      processNodes(node, childrenSource)

      if (node.name[0] == node.name[0].toUpperCase()) {

        source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(`)
        source.push(`${Package.name}Utilities.createElement(`)
        source.push(`${node.name}, `)
        source.push(`${attributesSource.join('\n')}, `)
        source.push(`${childrenSource.join('\n')}))`)

      } else {

        source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat(`)
        source.push(`${Package.name}Utilities.createTag(`)
        source.push(`'${node.name}', `)
        source.push(`${attributesSource.join('\n')}, `)
        source.push(`${childrenSource.join('\n')}))`)

      }

    }

  }

  // const processAttribute = (attribute, source, isMapped = true) => {
  //   Log.debug('- processAttribute(attribute)')
  //   Log.debug(`- attribute.name='${attribute.name}'`)
  //   Log.debug(`- attribute.val=${attribute.val}`)
  //   Log.debug(`- isMapped=${isMapped}`)
  //
  //   // if (isMapped) {
  //   //   source.push(`${Package.name}AttributeName = ${Package.name}Utilities.mapAttributeName('${attribute.name}')`)
  //   // } else {
  //   //   source.push(`${Package.name}AttributeName = '${attribute.name}'`)
  //   // }
  //   //
  //   // source.push(`${Package.name}AttributeValue = ${Package.name}Utilities.renderAttributeValue(${Package.name}AttributeName, ${attribute.val}, ${Package.name}Attributes[${Package.name}AttributeName])`)
  //   //
  //   // source.push(`if (${Package.name}AttributeValue) {`)
  //   //   if (attribute.mustEscape) {
  //   //     source.push(`${Package.name}Attributes[${Package.name}AttributeName] = ${Package.name}Utilities.escape(${Package.name}AttributeValue)`)
  //   //   } else {
  //   //     source.push(`${Package.name}Attributes[${Package.name}AttributeName] = ${Package.name}AttributeValue`)
  //   //   }
  //   // source.push('}')
  //
  //   source.push(`${Package.name}Utilities.addAttribute('${attribute.name}', ${attribute.val}, ${Package.name}Attributes, ${isMapped})`)
  //
  // }

  const processAttributes = (node, source, isMapped = true) => {
    Log.debug(`- processAttributes(node, source, ${isMapped})`)

    if (node.attrs.length > 0 ||
        node.attributeBlocks.length > 0) {

      source.push('(() => {')

      source.push(`let ${Package.name}Attributes = {}`)

      node.attrs.forEach((attribute) => {
        processAttribute(attribute, source, isMapped)
      })

      processAttributeBlocks(node, source)

      source.push(`return ${Package.name}Attributes`)
      source.push('})()')

    } else {
      // source.push('{}')
      source.push('null')
    }

  }

  const processAttribute = (attribute, source, isMapped = true) => {
    Log.debug(`- processAttribute(attribute, source, ${isMapped})`)
    Log.debug(`- attribute.name='${attribute.name}'`)
    Log.debug(`- attribute.val=${attribute.val}`)
    source.push(`${Package.name}Utilities.addAttribute('${attribute.name}', ${attribute.val}, ${Package.name}Attributes, ${isMapped}, ${attribute.mustEscape})`)
  }

  // const processAttributeBlock = (attributeBlock, source) => {
  //   Log.debug('- processAttributeBlock(attributeBlock)')
  //   Log.inspect('attributeBlock', attributeBlock)
  //
  //   // source.push(`${Package.name}AttributeBlock = ${attributeBlock}`)
  //   //
  //   // source.push(`${Package.name}Utilities.forEach(${Package.name}AttributeBlock, function(value, key) {`)
  //   // source.push(`${Package.name}AttributeName = ${Package.name}Utilities.mapAttributeName(key)`)
  //   // source.push(`${Package.name}AttributeValue = ${Package.name}Utilities.renderAttributeValue(${Package.name}AttributeName, value, ${Package.name}Attributes[${Package.name}AttributeName])`)
  //   //
  //   // source.push(`if (${Package.name}AttributeValue) {`)
  //   // source.push(`${Package.name}Attributes[${Package.name}AttributeName] = ${Package.name}AttributeValue`)
  //   // source.push('}')
  //   //
  //   // source.push('})')
  //
  //   source.push(`${Package.name}Utilities.forEach(${attributeBlock}, function(value, key) {`)
  //     source.push(`${Package.name}Utilities.addAttribute(key, value, ${Package.name}Attributes)`)
  //   source.push('})')
  //
  // }

  const processAttributeBlocks = (node, source) => {
    Log.debug('- processAttributeBlocks(node, source)')

    node.attributeBlocks.forEach((attributeBlock) => {
      processAttributeBlock(attributeBlock, source)
    })

  }

  const processAttributeBlock = (attributeBlock, source) => {
    Log.debug('- processAttributeBlock(attributeBlock, source)')
    Log.inspect('attributeBlock', attributeBlock)

    source.push(`${Package.name}Utilities.forEach(${attributeBlock}, function(value, key) {`)
    source.push(`${Package.name}Utilities.addAttribute(key, value, ${Package.name}Attributes)`)
    source.push('})')

  }

  const processNodes = (node, source) => {
    Log.debug('- processNodes(node, source)')

    if (node.block &&
        node.block.nodes.length > 0) {

      source.push('(() => {')
      source.push(`let ${Package.name}Nodes = []`)
      processBlock(node.block, source)
      source.push(`return ${Package.name}Nodes`)
      source.push('})()')

    } else {
      // source.push('[]')
      source.push('null')
    }

  }

  const processText = (node, source) => {
    Log.debug('- processText(node, source)')
    Log.debug(`- node.val='${EscapeJs(node.val)}'`)
    source.push(`${Package.name}Nodes = ${Package.name}Nodes.concat('${EscapeJs(node.val)}')`)
  }

  const withData = (source) => {
    Log.debug('> withData(source) { ... }')
    // Log.inspect('source (before)', source)

    source = With('data', source, [
      'require'
    ])

    Log.debug('< withData(source) { ... }')
    // Log.inspect('source (after)', source)

    return source

  }

  let root =
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

  Log.inspect('root', root)

  let renderSource = []

  renderSource.push(`const ${Package.name}Utilities = require('${options.require && options.require.utilities ? options.require.utilities : `${Package.name}/library/utilities`}')`)
  renderSource.push('')
  renderSource.push(`let ${Package.name}Nodes = []`)
  processNode(root, renderSource)
  renderSource.push(`return ${Package.name}Nodes[0]`)

  renderSource = withData(renderSource.join('\n'))

  Log.debug('< Transform.render(content, context, options) { ... }')
  // Log.inspect('renderSource', renderSource)

  return renderSource

}

// Transform._render = function (content, context, options) {
//   Log.debug('- Transform._render(content, context, options) { ... }')
//
//   let source = []
//
//   source.push('')
//   // source.push(`let ${Package.name}Utilities = require('${options.require && options.require.utilities ? options.require.utilities : `${Package.name}/library/utilities`}')`)
//   source.push(`const ${Package.name}Utilities = require('${options.require && options.require.utilities ? options.require.utilities : `${Package.name}/library/utilities`}')`)
//   source.push('')
//   // source.push(`return ${this.render(content, context, options)}`)
//   source.push(this.render(content, context, options))
//   source.push('')
//
//   source = source.join('\n')
//
//   Log.debug('> With(\'data\', source, ...)')
//   // Log.inspect('source', source)
//
//   return With('data', source, [
//     'Object',
//     'require'
//   ])
//
// }

Transform.renderModule = function (content, context, options) {
  Log.debug('> Transform.renderModule(content, context, options) { ... }')

  let source = []

  source.push('module.exports = function (data) {')
  source.push(this.render(content, context, options))
  source.push('}')

  source = this.format(source.join('\n'))

  Log.debug('< Transform.renderModule(content, context, options) { ... }')
  Log.inspect('source', source)

  return source

}

Transform.compilePath = function (path, options) {
  Log.debug('> Transform.compilePath(path, options) { ... }')

  let content = FileSystem.readFileSync(path, {
    'encoding': 'utf-8'
  })

  let source = []

  source.push(`function ${Package.name}Render (data) {`)
  source.push(this.render(content, {
    'path': path
  }, options))
  source.push('}')

  source = this.format(source.join('\n'))

  let _source = []

  _source.push(source)
  _source.push(`return ${Package.name}Render(data)`)

  _source = _source.join('\n')

  Log.debug('< Transform.compilePath(path, options) { ... }')
  Log.inspect('_source', _source)

  return (new Function('require', 'data', _source)).bind({}, require)

}

Transform.format = function (source) {
  Log.debug('> Transform.format(source) { ... }')
  // Log.inspect('source (before)', source)

  source = Compile(source, {
    'presets': [
      'es2015'
    ]
  }).code

  // Log.inspect('source (during)', source)

  source = Format(source, {
    'printWidth': 100,
    'tabWidth': 2,
    'singleQuote': true,
    'trailingComma': false,
    'bracketSpacing': true
  })

  Log.debug('< Transform.format(source) { ... }')
  // Log.inspect('source (after)', source)

  return source

}

module.exports = Transform
