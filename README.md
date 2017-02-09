# nessa

*_Nessa_ was an Ainu and a Valië and was ranked the least among the Valar. She
was notable for her speed, being fast "as an arrow in movement", for which reason
she was called _Nessa the Swift_.*

A [Babel](https://babeljs.io/) plug-in and [Webpack](https://webpack.github.io/)
loader which translate [Pug](http://pugjs.org/) templates into Hyperscript for [virtual-dom](https://github.com/Matt-Esch/virtual-dom) diffing/rendering flows.

[![NPM](https://nodei.co/npm/nessa.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nessa/)

## Installation

Add `nessa` to dev dependencies in `package.json`:

    npm install --save-dev nessa

Either tell Babel to use this plug-in in `.babelrc`:

```javascript
"plugins": [
  "nessa/library/transpiler",
]
```

Or tell Webpack to use this loader for `.pug` files in `webpack.config.js`:

```javascript
var webpackConfig = {
  module: {
    loaders: [
      {
        test: /\.pug$/,
        loader: 'nessa/library/loader',
      },
    ],
  },

  // ...

};
```

## Configuration

The recommended way to configure Babel options for `nessa` is with plug-in
options, e.g.:

```javascript
"plugins": [
  [
    "nessa/library/transpiler",
    {
      "isDebugged": true,
      "logPath": "./process/logs/nessa.babel.log",
      "require": {
        "utilities": "./library/utilities"
      },
      "test": "\\.pug$"
    }
  ]
]
```

The available options are:
- `isDebugged`
- `logPath`
- `require.utilities`
- `test`

The recommended way to configure Webpack options for `nessa` is with a top-level
`nessa` object, e.g.:

```javascript
var webpackConfig = {
  module: {
    // ...
  },

  'nessa': {
    'isDebugged': true,
    'logPath': './process/logs/nessa.webpack.log',
    'require': {
      'utilities': 'nessa/library/utilities'
    }
  }

  // ...
};
```

The available options are:
- `isDebugged`
- `logPath`
- `require.utilities`

## Usage

With Babel or Webpack configured as above, simply `import`/`require` (for Webpack)
or `require` (for Babel) a Pug file to access the compiled template function,
which returns a virtual-dom `VNode` instead of HTML:

```javascript
const template = require('./index.pug');
let vtree = template({foo: 'bar'});
```

## License

ISC
