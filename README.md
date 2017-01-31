# nessa

A [Webpack](https://webpack.github.io/) loader which translates [Pug](http://pugjs.org/) templates into Hyperscript for
[virtual-dom](https://github.com/Matt-Esch/virtual-dom) diffing/rendering
flows.

## Installation

Add `nessa` to dev dependencies in `package.json`:

    npm install --save-dev nessa

Tell Webpack to use this loader for `.pug` files, in `webpack.config.js`:

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

The recommended way to configure options for `nessa` is with a top-level `nessa` object, e.g.:
```javascript
var webpackConfig = {
  module: {
    // ...
  },

  'nessa': {
    'debug': true,
    'logPath': './process/logs/nessa.webpack.log',
    'require': {
      'utilities': 'nessa/library/utilities'
    }
  }

  // ...
};
```

The available options are:
- `debug`
- `logPath`
- `utilities`

See the [nessa documentation](https://github.com/virtualpatterns/nessa#api) for an explanation of the options.

## Usage

With Webpack configured as above, simply import/require a Pug file to
access the compiled template function, which returns a virtual-dom `VNode`
instead of HTML:

```javascript
import template from './index.pug';
const vtree = template({foo: 'bar'});
```

## License

ISC
