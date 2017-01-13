# [Emmet](http://emmet.io) abbreviation expander

Reference implementation of Emmet’s “Expand Abbreviation” action.

```js
import { expand } from '@emmetio/expand-abbreviation';

console.log(expand('ul.nav>.nav-item{Item $}*2'));
// outputs:
// <ul class="nav">
//   <li class="nav-item">Item 1</li>
//   <li class="nav-item">Item 2</li>
// </ul>

// use XHTML-style output
console.log(expand('img[src=image.png]', {
    profile: {
        selfClosingStyle: 'xhtml'
    }
}));
// outputs: <img src="image.png" alt="" />

// Output in Slim syntax
console.log(expand('ul.nav>.nav-item{Item $}*2', {syntax: 'slim'}));
// outputs:
// ul.nav
//   li.nav-item Item 1
//   li.nav-item Item 2
```

## API

This module exports two functions: `parse(abbr, options)` and `expand(abbr, options)`.

The `parse(abbr, options)` function [parses abbreviation into tree](https://github.com/emmetio/abbreviation), applies various transformations required for proper output and returns parsed tree. The `expand(abbr, options)` does the same but returns formatted string. In most cases you should use `expand(abbr, options)` only but if you want to update parsed abbreviation somehow, you can `parse()` abbreviation first, update parsed tree and then `expand()` it:

```js
import { parse, expand } from '@emmetio/expand-abbreviation';

// 1. Parse string abbreviation into tree
const tree = parse('ul>.item*3');

// 2. Walk on each tree node, update them somehow
tree.walk(node => { ... });

// 3. Output result
console.log(expand(tree));
```

### Options

Both `parse()` and `expand()` methods accept the following options:

* `syntax` (string): abbreviation output syntax. Currently supported syntaxes are: `html`, `slim`, `pug`, `haml`.
* `field(index, placeholder)` (function): field/tabstop generator for host editor. Most editors support TextMate-style fields: `${0}` or `${1:placeholder}`. For TextMate-style fields this function will look like this:

```js
const field = (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`;
```

> Emmet natively supports TextMate fields and provides [module for parsing them](https://github.com/emmetio/field-parser).

* `text` (string or array of strings): insert given text string(s) into expanded abbreviation. If array of strings is given, the implicitly repeated element (e.g. `li*`) will be repeated by the amount of items in array.
* `profile` (object or [`Profile`](https://github.com/emmetio/output-profile)): either predefined [output profile](https://github.com/emmetio/output-profile) or options for output profile. Used for by [markup formatters](https://github.com/emmetio/markup-formatters) to shape-up final output.
* `variables` (object): custom variables for [variable resolver](https://github.com/emmetio/variable-resolver).
* `snippets` (object, array of objects or [`SnippetsRegistry`](https://github.com/emmetio/snippets-registry)): custom predefined snippets for abbreviation. The expanded abbreviation will try to match given snippets that may contain custom elements, predefined attributes etc. May also contain array of items: either snippets (object) or references to [default syntax snippets](https://github.com/emmetio/snippets) (string; the key in default snippets hash).
* `addons` (object): hash of [additional transformations](https://github.com/emmetio/html-transform/tree/master/lib/addons) that should be applied to expanded abbreviation, like BEM or JSX. Since these transformations introduce side-effect, they are disabled by default and should be enabled by providing a transform name as key and transform options as value:

```js
{
    bem: {element: '--'}, // enable transform & override options
    jsx: true // no options, just enable transform
}
```

* `format` (object): additional options for output formatter. Currently, [HTML element commenting](https://github.com/emmetio/markup-formatters/blob/master/format/html.js#L33) is the only supported format option.

See [`test`](/test) folder for usage examples.

## Design goals

This module is just an umbrella projects that combines various stand-alone submodules into a unified process for parsing and outputting Emmet abbreviations. Thus, you can create your own “Expand Abbreviation” implementation that can re-use these submodules with additional tweaks and transforms that matches your requirements.

The standard abbreviation expanding workflow:

1. [Parse Emmet abbreviation](https://github.com/emmetio/abbreviation) into DOM-like tree.
1. [Prepare parsed tree for markup output](https://github.com/emmetio/html-transform). This step includes implicit name resolving (`.item` → `div.item`), item numbering (`.item$*2` → `.item1+.item2`) and so on.
1. Match tree nodes with [predefined snippets](https://github.com/emmetio/snippets). Snippets are basically another Emmet abbreviations that define element shape (name, attributes, self-closing etc.).
1. [Resolve variables](https://github.com/emmetio/variable-resolver) in parsed tree.
1. Convert parsed abbreviation to formatted string using [markup formatters](https://github.com/emmetio/markup-formatters).

## Build targets

`@emmetio/expand-abbreviation` NPM module is available in two flavors: CommonJS and ES6 modules. There’s also a complete, zero-dependency UMD module suitable for browsers (see `dist/expand-full.js`).
