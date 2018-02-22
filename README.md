# nessa

*_Nessa_ was an Ainu and a Valië and was ranked the least among the Valar. She
was notable for her speed, being fast "as an arrow in movement", for which reason
she was called _Nessa the Swift_.*

A [Babel](https://babeljs.io/) plug-in which translate [Pug](http://pugjs.org/)
templates into Hyperscript for [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
diffing/rendering flows.

[![NPM](https://nodei.co/npm/nessa.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nessa/)

## Installation

Add `@virtualpatterns/nessa` to dev dependencies in `package.json`:

    npm install --save-dev @virtualpatterns/nessa

Tell Babel to use this plug-in in `.babelrc`:

```javascript
"plugins": [
  "@virtualpatterns/nessa/distributables/library/transpiler"
]
```

## Configuration

The recommended way to configure Babel options for `nessa` is with plug-in
options, e.g.:

```javascript
"plugins": [
  [
    "@virtualpatterns/nessa/distributables/library/transpiler",
    {
      "isDebugged": true,
      "logPath": "./process/logs/babel.log",
      "test": "\\.pug$"
    }
  ]
]
```

#### `isDebugged` and `logPath`

The `isDebugged` and `logPath` options control logging information.  By default
no logging output is produced.  If only `isDebugged` is specified and is `true`
logging output is written to the console.  If only `logPath` is specified,
regardless of `isDebugged`, logging output is written to the path specified.

#### `test`

The `test` option controls the files on which the plug-in operates and defaults
to files that end in a `.pug` extension.

## Usage

With Babel configured as above simply `require` a Pug file to access the template
function which returns a virtual-dom `VNode` instead of HTML:

```javascript
import Utilities from '@virtualpatterns/nessa'

const Template = require('./index.pug')

let virtualContent = Template({ 'foo': 'bar', Utilities });
```

## Example

A sample application that uses the Babel plug-in can be
found [here](https://github.com/virtualpatterns/nessa-sample).

## Custom Elements

Custom elements can be included in templates and are simply passed as variables.

```javascript
import Utilities from '@virtualpatterns/nessa'

const Welcome = require('./welcome.pug')
const Default = require('./default.pug')
```

... where `welcome.pug` is ...

```
h1 Welcome #{name}
```

... and `default.pug` is ...

```
div
  Welcome(  name=name
            Utilities!=Utilities)
  p #{name}'s Pug source code!
```

... and the `Default` template function is called passing a value for the `Welcome`
template function, the `name` variable, and the `Utilities` object, e.g.:

```javascript
let virtualContent = Default({
    Welcome,
    'name': 'Forbes',
    Utilities
  })
```

## License

GPL-3.0+
