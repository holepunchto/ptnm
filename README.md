# `ptnm`

> Object Pattern Matching

- zero production dependencies
- tiny code footprint
- production battle-tested in [Pear](https://github.com/holepunchto/pear)

## Usage

`ptnm` matches a **pattern object** against a **message object**.

A match succeeds when **all enumerable own properties** in the pattern exist in the message
and are **strictly equal**, recursively.

Extra properties in the message are ignored.

- Non-coercive matching (`===`)
- Own properties only (non-enumerable/inherited pattern keys ignored)
- No cycle detection by design - do not pass circular objects

### Include

```js
const match = require('ptnm')
```

```js
import match from 'ptnm'
```

### Basic

```js
match({ a: 1, b: 2 }, { a: 1 }) // true
```

### Nested

```js
match({ a: { b: 1, c: 2 } }, { a: { b: 1 } })
// true
```

### Missing or unequal values

```js
match({ a: 1 }, { a: 2 })
// false

match({}, { a: 1 })
// false
```

## License

Apache-2.0
